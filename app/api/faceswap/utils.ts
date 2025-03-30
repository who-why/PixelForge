import type { FaceSwapResponse } from '@/types/faceswap'
import axios from 'axios'

const API_KEY = 'b3786701-b5f3-4b42-b5fe-a7c7c5a46d86'
const API_URL = 'https://api.imagepig.com/faceswap'

export async function processFaceSwap(sourceImage: string, targetImage: string): Promise<FaceSwapResponse> {
  try {
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await axios.post(
      API_URL,
      {
        source_image_url: sourceImage.startsWith('http') ? sourceImage : undefined,
        target_image_url: targetImage.startsWith('http') ? targetImage : undefined,
        source_image_data: !sourceImage.startsWith('http') ? sourceImage : undefined,
        target_image_data: !targetImage.startsWith('http') ? targetImage : undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': API_KEY,
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