"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCard from "@/components/constant/userCard";
import DownloadImage from "@/components/common/DownloadImage";
import { Download, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageData {
  _id: string;
  imageUrl: string;
  type: 'generated' | 'faceswap' | 'removebg';
  createdAt: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

const defaultAvatarPath = '/images/default-avatar.png';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null); // Reset error state before new fetch
      try {
        const response = await fetchWithTimeout('/api/images', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Add this to ensure cookies are sent
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to load images (${response.status})`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(
          error instanceof Error 
            ? error.message
            : 'Failed to load images. Please try again later.'
        );
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchImages();
    } else {
      setImages([]);
      setLoading(false);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-white">Please sign in to view your profile</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 container mx-auto px-4 py-8">
      <UserCard/>
      <h1 className="text-3xl font-bold text-white mb-2">My Creations</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all" className="cursor-pointer">All</TabsTrigger>
          <TabsTrigger value="generated" className="cursor-pointer">Generated</TabsTrigger>
          <TabsTrigger value="faceswap" className="cursor-pointer">Face Swap</TabsTrigger>
          <TabsTrigger value="bgremoval" className="cursor-pointer">BG Removal</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ImageGrid images={images || []} />
        </TabsContent>

        <TabsContent value="generated">
          <ImageGrid images={images?.filter(img => img.type === 'generated') || []} />
        </TabsContent>

        <TabsContent value="faceswap">
          <ImageGrid images={images?.filter(img => img.type === 'faceswap') || []} />
        </TabsContent>

        <TabsContent value="bgremoval">
          <ImageGrid images={images?.filter(img => img.type === 'removebg') || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ImageGrid({ images }: { images: ImageData[] }) {
  const router = useRouter();

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-white">
        No images found in this category
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images?.map((image:any) => (
        <div
          key={image._id}
          className="relative group bg-[#2a2a42] rounded-lg overflow-hidden"
        >
          <div className="aspect-square relative">
            <Image
              src={image.imageUrl.startsWith('/9j/') ? `data:image/jpeg;base64,${image.imageUrl}` : image.imageUrl}
              alt={`${image.type} image`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', image.imageUrl);
              }}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <DownloadImage 
                imageUrl={image.imageUrl} 
                fileName={`${image.type}_${image._id}`}
                className="cursor-pointer"
              />
              <button
                onClick={() => router.push(`/edit?image=${encodeURIComponent(image.imageUrl)}`)}
                className="p-2 cursor-pointer rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                title="Edit Image"
              >
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <p className="text-sm capitalize">{image.type}</p>
            <p className="text-xs opacity-75">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}