import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageUploadProps {
  title: string;
  subtitle: string;
  image: string | null;
  onImageSelect: (image: string | null) => void;
  icon: React.ReactNode;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  subtitle,
  image,
  onImageSelect,
  icon,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg px-6 py-7">
      <h3 className="text-xl text-gray-800 font-serif font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{subtitle}</p>

      {image ? (
        <div className="relative">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={`data:image/jpeg;base64,${image}`}
            alt="Uploaded image"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={() => onImageSelect(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${
              isDragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-500'
            }
          `}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="text-purple-500 mb-4"
          >
            {icon}
          </motion.div>
          <p className="text-gray-600 text-center">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;