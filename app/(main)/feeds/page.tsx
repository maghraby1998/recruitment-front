"use client";

import { GET_POSTS } from "@/app/_graphql/queries";
import {
  CREATE_POST,
  CREATE_COMMENT,
  CREATE_REACTION,
} from "@/app/_graphql/mutations";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { IconSend } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserAvatar from "@/components/ui/company-avatar";
import { UserType } from "@/components/context-provider";
import moment from "moment";
import { BACKEND_URL } from "@/app/_config";
import { cn } from "@/lib/utils";

enum PostType {
  CELEBRATION = "CELEBRATION",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  OPINION = "OPINION",
  QUESTION = "QUESTION",
  OTHER = "OTHER",
}

enum ReactType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  WOW = "WOW",
  CELEBRATE = "CELEBRATE",
}

type PostUser = {
  id: string;
  user_type: string;
  employee?: {
    firstName: string;
    lastName: string;
    imgPath: string;
    position?: {
      title: string;
    };
  };
  company?: {
    name: string;
    imgPath: string;
  };
};

type CommentUser = {
  id: string;
  user_type: string;
  employee?: {
    firstName: string;
    lastName: string;
    imgPath: string;
  };
  company?: {
    name: string;
    imgPath: string;
  };
};

type Comment = {
  id: string;
  content: string;
  user: CommentUser;
};

type PostReaction = {
  count: number;
  type: ReactType;
};

type Post = {
  id: string;
  content: string;
  type: PostType;
  created_at: string;
  user: PostUser;
  comments: Comment[];
  reactions: PostReaction[];
};

const REACTION_EMOJIS: Record<ReactType, string> = {
  [ReactType.LIKE]: "👍",
  [ReactType.DISLIKE]: "👎",
  [ReactType.LOVE]: "❤️",
  [ReactType.HAHA]: "😂",
  [ReactType.WOW]: "😮",
  [ReactType.CELEBRATE]: "🎉",
};

function PostCard({
  post,
  onAddComment,
  onReact,
}: {
  post: Post;
  onAddComment: (postId: string, content: string) => void;
  onReact: (postId: string, reactType: ReactType) => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const user = post.user;
  const isEmployee = user.user_type === UserType.EMPLOYEE;

  const userName = isEmployee
    ? `${user.employee?.firstName} ${user.employee?.lastName}`
    : (user.company?.name ?? "Unknown");

  const userImage = isEmployee ? user.employee?.imgPath : user.company?.imgPath;
  const userPosition = isEmployee ? user.employee?.position?.title : undefined;

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {userImage ? (
            <Image
              src={`${BACKEND_URL}${userImage}`}
              alt={userName}
              width={40}
              height={40}
              className="rounded-[50%] object-cover"
              style={{ width: 40, height: 40 }}
              unoptimized
            />
          ) : (
            <UserAvatar
              employee={
                isEmployee
                  ? {
                      firstName: user.employee?.firstName ?? "",
                      lastName: user.employee?.lastName ?? "",
                      imgPath: "",
                    }
                  : undefined
              }
              company={
                !isEmployee
                  ? { name: user.company?.name ?? "", imgPath: "" }
                  : undefined
              }
              userType={isEmployee ? "EMPLOYEE" : "COMPANY"}
              size="md"
            />
          )}
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-gray-500">
              {userPosition && `${userPosition} • `}
              {moment(post.created_at).fromNow()}
            </p>
          </div>
          {/* <span className="ml-auto bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded">
            {post.type}
          </span> */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>

        {post.reactions && post.reactions.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {post.reactions.map((reaction) => (
              <div
                key={reaction.type}
                className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-sm"
              >
                <span>{REACTION_EMOJIS[reaction.type]}</span>
                <span className="text-gray-600">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {Object.values(ReactType).map((reactType) => (
            <Button
              key={reactType}
              variant="outline"
              size="sm"
              onClick={() => onReact(post.id, reactType)}
              className="text-lg px-2 py-1"
            >
              {REACTION_EMOJIS[reactType]}
            </Button>
          ))}
        </div>

        <div className="border-t pt-3">
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <Button onClick={handleSubmitComment} size="icon">
              <IconSend className="w-4 h-4" />
            </Button>
          </div>

          {post.comments.length > 0 && (
            <div>
              <Button
                variant="link"
                onClick={() => setShowComments(!showComments)}
                className="p-0 mb-2"
              >
                {showComments ? "Hide" : "Show"} {post.comments.length} comment
                {post.comments.length !== 1 ? "s" : ""}
              </Button>

              {showComments && (
                <div className="space-y-2">
                  {post.comments.map((comment) => {
                    const commentUser = comment.user;
                    const isCommentEmployee = commentUser.user_type === UserType.EMPLOYEE;
                    const commentUserName = isCommentEmployee
                      ? `${commentUser.employee?.firstName} ${commentUser.employee?.lastName}`
                      : commentUser.company?.name ?? "Unknown";
                    const commentUserImage = isCommentEmployee
                      ? commentUser.employee?.imgPath
                      : commentUser.company?.imgPath;

                    return (
                      <div
                        key={comment.id}
                        className="bg-gray-50 p-2 rounded text-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {commentUserImage ? (
                            <Image
                              src={`${BACKEND_URL}${commentUserImage}`}
                              alt={commentUserName}
                              width={20}
                              height={20}
                              className="rounded-[50%] object-cover"
                              style={{ width: 20, height: 20 }}
                              unoptimized
                            />
                          ) : (
                            <UserAvatar
                              employee={isCommentEmployee ? { firstName: commentUser.employee?.firstName ?? "", lastName: commentUser.employee?.lastName ?? "", imgPath: "" } : undefined}
                              company={!isCommentEmployee ? { name: commentUser.company?.name ?? "", imgPath: "" } : undefined}
                              userType={isCommentEmployee ? "EMPLOYEE" : "COMPANY"}
                              size="sm"
                            />
                          )}
                          <span className="font-semibold text-xs">{commentUserName}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedsPage() {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<PostType>(PostType.OTHER);

  const { data, loading, refetch } = useQuery(GET_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      pagination: { page: 1, limit: 20 },
    },
  }) as {
    data: {
      posts: {
        data: Post[];
        meta: {
          totalItems: number;
          totalPages: number;
          currentPage: number;
          limit: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      };
    };
    loading: boolean;
    refetch: () => void;
  };

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setNewPostContent("");
      setNewPostType(PostType.OTHER);
      refetch();
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      refetch();
    },
  });

  const [createReaction] = useMutation(CREATE_REACTION, {
    onCompleted: () => {
      refetch();
    },
  });

  const posts = data?.posts?.data ?? [];

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

  const handleAddComment = (postId: string, content: string) => {
    createComment({
      variables: {
        input: {
          postId,
          content,
        },
      },
    });
  };

  const handleReact = (postId: string, reactType: ReactType) => {
    createReaction({
      variables: {
        input: {
          postId,
          reactType,
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Create Post</h2>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNewPostContent(e.target.value)
              }
              className={cn(
                "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "mb-3",
              )}
              rows={3}
            />
            <div className="flex gap-2 items-center">
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
          </CardContent>
        </Card>
      </div>

      <div>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts yet. Be the first to post!
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onAddComment={handleAddComment}
              onReact={handleReact}
            />
          ))
        )}
      </div>
    </div>
  );
}
