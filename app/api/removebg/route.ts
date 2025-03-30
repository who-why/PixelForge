import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import busboy from 'busboy';
import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { PythonShell, Options } from 'python-shell';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to remove background using rembg
const removeBackground = async (inputPath: string): Promise<string> => {
  const outputPath = path.join(process.cwd(), 'public', `${randomUUID()}.png`);
  console.log('Input path:', inputPath);
  console.log('Output path:', outputPath);
  
  return new Promise((resolve, reject) => {
    const options: Options = {
      mode: 'text' as const,
      pythonPath: 'python',
      scriptPath: path.join(process.cwd(), 'scripts'),
      args: [inputPath, outputPath]
    };

    let timeoutId: NodeJS.Timeout;
    const pyshell = new PythonShell('remove_bg.py', options);

    // Set a timeout of 5 minutes
    timeoutId = setTimeout(() => {
      pyshell.terminate();
      reject(new Error('Background removal timed out after 5 minutes'));
    }, 5 * 60 * 1000);

    pyshell.on('message', (message) => {
      console.log('Python script message:', message);
    });

    pyshell.on('stderr', (stderr) => {
      console.error('Python script error:', stderr);
    });

    pyshell.end((err) => {
      clearTimeout(timeoutId);
      if (err) {
        reject(err);
      } else {
        resolve(outputPath);
      }
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ 
        error: 'Content-Type must be multipart/form-data' 
      }, { status: 400 });
    }

    // Create temporary directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Create a promise to handle the file upload
    const filePromise = new Promise((resolve, reject) => {
      // Convert Headers to plain object for busboy
      const headers: IncomingHttpHeaders = {};
      req.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const bb = busboy({ headers });
      let filePath: string | null = null;

      bb.on('file', (name, file, info) => {
        if (name !== 'image') {
          file.resume();
          return;
        }

        // Add file size limit (e.g., 10MB)
        let fileSize = 0;
        const maxSize = 10 * 1024 * 1024; // 10MB

        file.on('data', (data) => {
          fileSize += data.length;
          if (fileSize > maxSize) {
            file.destroy(new Error('File size too large'));
          }
        });

        // Generate a unique filename
        const uniqueFilename = `${randomUUID()}-${info.filename}`;
        filePath = path.join(tmpDir, uniqueFilename);

        // Create a write stream
        const writeStream = fs.createWriteStream(filePath);
        file.pipe(writeStream);

        writeStream.on('finish', () => {
          resolve(filePath);
        });

        writeStream.on('error', (err) => {
          reject(err);
        });
      });

      bb.on('error', (err) => {
        reject(err);
      });

      bb.on('finish', () => {
        if (!filePath) {
          reject(new Error('No file uploaded'));
        }
      });

      // Convert request body to buffer and write to busboy
      (async () => {
        try {
          const chunks = [];
          const reader = req.body?.getReader();
          if (!reader) {
            reject(new Error('No request body'));
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            bb.write(value);
          }
          bb.end();
        } catch (error) {
          reject(error);
        }
      })();
    });

    // Wait for the file to be uploaded
    const uploadedFilePath = await filePromise;

    if (!uploadedFilePath) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Process the image using rembg
    console.log('Starting background removal...');
    const outputPath = await removeBackground(uploadedFilePath as string);
    console.log('Background removal completed. Output path:', outputPath);

    // Verify the file exists before sending response
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const filename = path.basename(outputPath);
    console.log('Final filename:', filename);

    // Clean up temporary file
    try {
      fs.unlinkSync(uploadedFilePath as string);
      console.log('Temporary file cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up temporary file:', error);
    }

    // Verify the file exists in public directory
    const publicPath = path.join(process.cwd(), 'public', filename);
    if (!fs.existsSync(publicPath)) {
      throw new Error('File not found in public directory');
    }

    // After successful background removal, save to MongoDB
    const { db } = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.collection('images').insertOne({
      userId: session.user.email,
      imageUrl: `/${filename}`,
      type: 'removebg',
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Background removed successfully',
      imageUrl: `/${filename}`,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
