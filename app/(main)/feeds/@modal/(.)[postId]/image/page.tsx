"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BACKEND_URL } from "@/app/_config";
import { IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function ImageViewerModal({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resolvedParams, setResolvedParams] = useState<{ postId: string }>();

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const initialIndex = parseInt(searchParams.get("index") || "0", 10);
  const imagesParam = searchParams.get("images");

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (imagesParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(imagesParam));
        setImages(decoded);
      } catch {
        setImages([]);
      }
    }
  }, [imagesParam]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleClose = () => {
    router.back();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          <IconX className="w-6 h-6" />
        </Button>
        <div className="text-white">No images</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
      >
        <IconX className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
      >
        <IconChevronLeft className="w-8 h-8" />
      </Button>

      <div className="relative max-w-full max-h-full p-4">
        <Image
          src={`${BACKEND_URL}${images[currentIndex]}`}
          alt={`Image ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-h-[90vh] w-auto h-auto object-contain"
          priority
          unoptimized
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
      >
        <IconChevronRight className="w-8 h-8" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
