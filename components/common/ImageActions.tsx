import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import DownloadImage from "./DownloadImage";

interface ImageActionsProps {
  imageUrl: string;
  fileName?: string;
  className?: string;
}

export default function ImageActions({ imageUrl, fileName = 'image', className = '' }: ImageActionsProps) {
  const router = useRouter();

  return (
    <div className={`flex gap-2 ${className}`}>
      <DownloadImage 
        imageUrl={imageUrl} 
        fileName={fileName}
        className="cursor-pointer"
      />
      <button
        onClick={() => router.push(`/edit?image=${encodeURIComponent(imageUrl)}`)}
        className="p-2 cursor-pointer rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        title="Edit Image"
      >
        <Edit className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}