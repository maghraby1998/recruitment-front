"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@apollo/client/react";
import { useState, useRef, type ChangeEvent } from "react";
import { GET_POSTS } from "@/app/_graphql/queries";
import { CREATE_POST } from "@/app/_graphql/mutations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IconPhoto, IconX } from "@tabler/icons-react";
import Image from "next/image";

enum PostType {
  CELEBRATION = "CELEBRATION",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  OPINION = "OPINION",
  QUESTION = "QUESTION",
  OTHER = "OTHER",
}

export default function CreatePostModal() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<PostType>(PostType.OTHER);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => {
      router.back();
    },
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const handleClose = () => {
    imagePreviews.forEach(URL.revokeObjectURL);
    router.back();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleCreatePost = () => {
    if (newPostContent.trim() || selectedImages.length > 0) {
      createPost({
        variables: {
          input: {
            content: newPostContent,
            type: newPostType,
          },
          images: selectedImages,
        },
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewPostContent(e.target.value)
            }
            className={cn(
              "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            )}
          />
          <Select
            value={newPostType}
            onValueChange={(value) => setNewPostType(value as PostType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PostType.CELEBRATION}>Celebration</SelectItem>
              <SelectItem value={PostType.ANNOUNCEMENT}>
                Announcement
              </SelectItem>
              <SelectItem value={PostType.OPINION}>Opinion</SelectItem>
              <SelectItem value={PostType.QUESTION}>Question</SelectItem>
              <SelectItem value={PostType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreviews.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-0.5"
                    >
                      <IconX className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <IconPhoto className="w-4 h-4 mr-2" />
                Add More Images
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <IconPhoto className="w-4 h-4 mr-2" />
              Add Images
            </Button>
          )}
          <Button onClick={handleCreatePost}>Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
