'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import Image from 'next/image'

function EditContent() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('image')
  
  const [crop, setCrop] = useState<Crop>()
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [scale, setScale] = useState(100)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const handleDownload = async () => {
    if (!imageRef) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a temporary image element
    // Add type checking before using imageUrl
    if (!imageUrl) {
      return null; // or handle the null case appropriately
    }

    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = imageUrl.startsWith('/9j/') ? `data:image/jpeg;base64,${imageUrl}` : imageUrl;

    img.onload = () => {
      // Set initial dimensions
      let finalWidth = img.naturalWidth;
      let finalHeight = img.naturalHeight;

      // Apply scaling
      finalWidth *= (scale / 100);
      finalHeight *= (scale / 100);

      // Set canvas size
      if (crop) {
        canvas.width = crop.width;
        canvas.height = crop.height;
      } else {
        canvas.width = finalWidth;
        canvas.height = finalHeight;
      }

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      if (crop) {
        // Draw cropped region
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
      } else {
        // Draw full image with scaling
        ctx.drawImage(
          img,
          0,
          0,
          finalWidth,
          finalHeight
        );
      }

      // Download with maximum quality
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataUrl;
      link.click();
    };
  };

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">No image selected for editing</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Image</h1>
        
        <div className="bg-[#2a2a42] rounded-lg p-4">
          <ReactCrop crop={crop} onChange={c => setCrop(c)}>
            <Image
              src={imageUrl.startsWith('/9j/') ? `data:image/jpeg;base64,${imageUrl}` : imageUrl}
              alt="Image to edit"
              width={800}
              height={800}
              className="object-contain w-full"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                transform: `scale(${scale / 100})`,
                transformOrigin: 'center'
              }}
              priority
              onLoadingComplete={(img) => setImageRef(img)}
            />
          </ReactCrop>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-white">Brightness</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white">Contrast</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white">Resize</label>
              <input
                type="range"
                min="10"
                max="200"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Download Edited Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Remove the EditPage function and only keep the Edit function as default export
export default function Edit() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <p className="text-white text-xl">Loading...</p>
    </div>}>
      <EditContent />
    </Suspense>
  )
}