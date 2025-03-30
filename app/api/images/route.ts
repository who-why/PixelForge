import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Define Image Schema
const ImageSchema = new mongoose.Schema({
  userId: String,
  imageUrl: String,
  type: String,
  createdAt: String
});

// Get or create model
const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);



export async function GET() {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Fetch images for the current user
    const images = await db
      .collection('images')
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { imageUrl, type } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!imageUrl) {
      throw new Error('No image data provided');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `${type}_${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, filename);
    const publicUrl = `/uploads/${filename}`;

    // Remove the data:image/jpeg;base64, prefix if present
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Write the file
    await writeFile(filePath, buffer);

    // Save to MongoDB
    const { db } = await connectToDatabase();
    await db.collection('images').insertOne({
      userId: session.user.email,
      imageUrl: publicUrl,
      type,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Image saved successfully to filesystem and database'
    });

  } catch (error: any) {
    console.error('Error in image save route:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to save image',
        details: error.toString()
      }, 
      { status: 500 }
    );
  }
}
const saveImage = async (imageUrl: string, type: 'generated' | 'faceswap' | 'bgremoval') => {
  const response = await fetch('/api/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl, type }),
  });
  return response.json();
};