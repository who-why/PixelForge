'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import ImageUpload from '@/components/imageUpload/ImageUpload';
import { processFaceSwap } from '@/app/api/faceswap/utils';

function App() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!sourceImage || !targetImage) {
      setError('Please upload both images first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await processFaceSwap(sourceImage, targetImage);
      
      if (!result || !result.image_data) {
        throw new Error('Failed to receive valid response from face swap API');
      }

      setResultImage(result.image_data);
      
      // Log the image data for debugging
      console.log('Image data received:', result.image_data.substring(0, 100) + '...');
      
      // Save the face-swapped image
      const saveResponse = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: result.image_data,
          type: 'faceswap'
        }),
      });

      const responseData = await saveResponse.json();
      
      if (!saveResponse.ok) {
        console.error('Save response error:', responseData);
        throw new Error(responseData.error || 'Failed to save the face-swapped image');
      }

      console.log('Image saved successfully:', responseData);
    } catch (err) {
      console.error('Face swap error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during face swapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-200 mb-4">Face Swap AI</h1>
          <p className="text-lg text-gray-200">Transform your photos with our advanced face swapping technology</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImageUpload
              title="Source Image"
              subtitle="Upload the face you want to use"
              image={sourceImage}
              onImageSelect={setSourceImage}
              icon={<Upload className="object-cover w-8 h-10" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ImageUpload
              title="Target Image"
              subtitle="Upload the image to swap into"
              image={targetImage}
              onImageSelect={setTargetImage}
              icon={<ImageIcon className="object-cover bg-center w-8 h-8" />}
            />
          </motion.div>
        </div>

        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleSwap}
            disabled={loading || !sourceImage || !targetImage}
            className={`
              px-8 py-4 rounded-full text-white font-semibold cursor-pointer
              ${loading || !sourceImage || !targetImage
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}
              transition-all duration-300 ease-in-out
            `}
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin inline" />
            ) : (
              <>
                <Wand2 className="w-6 h-6 inline mr-2" />
                Swap Faces
              </>
            )}
          </button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-8"
          >
            {error}
          </motion.div>
        )}

        {resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Result</h2>
            <img
              src={`data:image/jpeg;base64,${resultImage}`}
              alt="Face swap result"
              className="w-full rounded-lg shadow-xl"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;