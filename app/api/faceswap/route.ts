import axios from 'axios';
import { NextResponse } from 'next/server'
import type { FaceSwapResponse, FaceSwapRequest } from '@/types/faceswap'

const API_KEY = 'b3786701-b5f3-4b42-b5fe-a7c7c5a46d86'
const API_URL = 'https://api.imagepig.com/faceswap'; 

// Remove the interface since it's now imported

// Move processFaceSwap to a separate helper function
async function processFaceSwap(sourceImage: string, targetImage: string): Promise<FaceSwapResponse> {
  try {
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await axios.post(
      API_URL,
      {
        // If the images are URLs
        source_image_url: sourceImage.startsWith('http') ? sourceImage : undefined,
        target_image_url: targetImage.startsWith('http') ? targetImage : undefined,
        // If the images are base64
        source_image_data: !sourceImage.startsWith('http') ? sourceImage : undefined,
        target_image_data: !targetImage.startsWith('http') ? targetImage : undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': API_KEY, // Updated to match the docs
        },
        timeout: 30000,
      }
    );

    if (response.data.image_data) {
      return {
        ...response.data,
        url: `data:image/jpeg;base64,${response.data.image_data}`
      };
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Face swap API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        throw new Error('Unable to connect to the face swap service. Please try again later.');
      }
      
      throw new Error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to process face swap'
      );
    }
    throw error;
  }
}

// Export the POST handler instead
export async function POST(request: Request) {
    try {
        const data = await request.json() as FaceSwapRequest
        const { sourceImage, targetImage } = data

        const result = await processFaceSwap(sourceImage, targetImage)
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process face swap' },
            { status: 500 }
        )
    }
}