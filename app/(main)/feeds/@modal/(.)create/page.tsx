"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState, type ChangeEvent } from "react";
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

enum PostType {
  CELEBRATION = "CELEBRATION",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  OPINION = "OPINION",
  QUESTION = "QUESTION",
  OTHER = "OTHER",
}

export default function CreatePostModal() {
  const router = useRouter();
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<PostType>(PostType.OTHER);

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => {
      router.back();
    },
    refetchQueries: [{ query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } }],
  });

  const handleClose = () => {
    router.back();
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPost({
        variables: {
          input: {
            content: newPostContent,
            type: newPostType,
          },
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
              <SelectItem value={PostType.CELEBRATION}>
                Celebration
              </SelectItem>
              <SelectItem value={PostType.ANNOUNCEMENT}>
                Announcement
              </SelectItem>
              <SelectItem value={PostType.OPINION}>Opinion</SelectItem>
              <SelectItem value={PostType.QUESTION}>Question</SelectItem>
              <SelectItem value={PostType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreatePost}>Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
