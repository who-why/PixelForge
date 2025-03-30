import { Download } from "lucide-react";

interface DownloadImageProps {
  imageUrl: string;
  fileName?: string;
  className?: string;
}

const DownloadImage = ({ imageUrl, fileName = 'image', className = '' }: DownloadImageProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={`p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors ${className}`}
      title="Download Image"
    >
      <Download className="w-5 h-5 text-white" />
    </button>
  );
};

export default DownloadImage;