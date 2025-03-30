export interface FaceSwapResponse {
  image_data: string;
  mime_type: string;
  started_at: string;
  completed_at: string;
  url?: string;
  error?: string;
}

export interface FaceSwapRequest {
  sourceImage: string;
  targetImage: string;
}