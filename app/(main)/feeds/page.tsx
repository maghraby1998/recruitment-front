"use client";

import { GET_POSTS } from "@/app/_graphql/queries";
import {
  CREATE_COMMENT,
  CREATE_REACTION,
  DELETE_REACTION,
  CREATE_COMMENT_REACTION,
  DELETE_COMMENT_REACTION,
} from "@/app/_graphql/mutations";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconSend, IconMessageCircle } from "@tabler/icons-react";
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

type CommentReaction = {
  count: number;
  type: ReactType;
};

type Comment = {
  id: string;
  content: string;
  user: CommentUser;
  reactions: CommentReaction[];
  authReaction?: ReactType;
  parentId?: string | null;
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
  authReaction?: ReactType;
  imagesPaths?: string[];
};

const REACTION_EMOJIS: Record<ReactType, string> = {
  [ReactType.LIKE]: "👍",
  [ReactType.DISLIKE]: "👎",
  [ReactType.LOVE]: "❤️",
  [ReactType.HAHA]: "😂",
  [ReactType.WOW]: "😮",
  [ReactType.CELEBRATE]: "🎉",
};

type CommentWithReplies = Comment & { replies: CommentWithReplies[] };

function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId)!.replies.push(commentWithReplies);
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}

function CommentItem({
  comment,
  postId,
  onReactComment,
  onAddReply,
  depth = 0,
}: {
  comment: CommentWithReplies;
  postId: string;
  onReactComment: (
    commentId: string,
    reactType: ReactType,
    currentAuthReaction?: ReactType,
  ) => void;
  onAddReply: (postId: string, parentId: string, content: string) => void;
  depth?: number;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commentUser = comment.user;
  const isCommentEmployee = commentUser.user_type === UserType.EMPLOYEE;
  const commentUserName = isCommentEmployee
    ? `${commentUser.employee?.firstName} ${commentUser.employee?.lastName}`
    : (commentUser.company?.name ?? "Unknown");
  const commentUserImage = isCommentEmployee
    ? commentUser.employee?.imgPath
    : commentUser.company?.imgPath;

  const totalReactions =
    comment.reactions?.reduce((sum, r) => sum + r.count, 0) ?? 0;

  const reactionsWithCount =
    comment.reactions?.filter((r) => r.count > 0) ?? [];

  const handleMouseEnterReactions = () => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    setShowReactions(true);
  };

  const handleMouseLeaveReactions = () => {
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 200);
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onAddReply(postId, comment.id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const getDefaultReaction = () => comment.authReaction ?? ReactType.LIKE;

  return (
    <div className={cn("mt-2", depth > 0 && "ml-6")}>
      <div className={cn("bg-white p-2 rounded text-sm flex gap-2 items-start", depth > 0 && "border-l-2 border-gray-200")}>
        <div className="flex gap-2">
          {commentUserImage ? (
            <Image
              src={`${BACKEND_URL}${commentUserImage}`}
              alt={commentUserName}
              width={depth > 0 ? 20 : 25}
              height={depth > 0 ? 20 : 25}
              className="rounded-[50%] object-cover"
              style={{
                width: depth > 0 ? 20 : 25,
                height: depth > 0 ? 20 : 25,
              }}
              unoptimized
            />
          ) : (
            <UserAvatar
              employee={
                isCommentEmployee
                  ? {
                      firstName: commentUser.employee?.firstName ?? "",
                      lastName: commentUser.employee?.lastName ?? "",
                      imgPath: "",
                    }
                  : undefined
              }
              company={
                !isCommentEmployee
                  ? {
                      name: commentUser.company?.name ?? "",
                      imgPath: "",
                    }
                  : undefined
              }
              userType={isCommentEmployee ? "EMPLOYEE" : "COMPANY"}
              size={depth > 0 ? "sm" : "sm"}
            />
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="bg-gray-100 rounded-lg p-2">
            <span className="font-semibold text-xs">{commentUserName}</span>
            <p className="text-gray-700">{comment.content}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="relative"
              onMouseEnter={handleMouseEnterReactions}
              onMouseLeave={handleMouseLeaveReactions}
            >
              <button
                onClick={() =>
                  onReactComment(
                    comment.id,
                    getDefaultReaction(),
                    comment.authReaction,
                  )
                }
                className={cn(
                  "text-xs hover:underline",
                  comment.authReaction && "text-blue-600 font-semibold",
                )}
              >
                {comment.authReaction
                  ? REACTION_EMOJIS[comment.authReaction]
                  : "Like"}
                {totalReactions > 0 && ` (${totalReactions})`}
              </button>
              {showReactions && (
                <div className="absolute bottom-full mb-1 left-0 bg-white rounded-full shadow-lg border px-1 py-0.5 flex gap-0.5 z-50">
                  {Object.values(ReactType).map((reactType) => (
                    <button
                      key={reactType}
                      onClick={() => {
                        onReactComment(
                          comment.id,
                          reactType,
                          comment.authReaction,
                        );
                        setShowReactions(false);
                      }}
                      className={cn(
                        "text-sm p-0.5 hover:bg-gray-100 rounded-full transition-transform hover:scale-125",
                        comment.authReaction === reactType && "bg-blue-50",
                      )}
                      title={reactType}
                    >
                      {REACTION_EMOJIS[reactType]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-gray-500 hover:underline"
            >
              Reply
            </button>
          </div>

          {showReplyInput && (
            <div className="flex gap-1 mt-2">
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitReply()}
                className="h-7 text-xs"
              />
              <Button onClick={handleSubmitReply} size="sm" className="h-7">
                <IconSend className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReactComment={onReactComment}
              onAddReply={onAddReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const POST_TYPE_LABELS: Record<PostType, string> = {
  [PostType.CELEBRATION]: "celebrating",
  [PostType.ANNOUNCEMENT]: "announcing",
  [PostType.OPINION]: "sharing an opinion",
  [PostType.QUESTION]: "asking",
  [PostType.OTHER]: "",
};

function PostCard({
  post,
  onAddComment,
  onReact,
  onReactComment,
  onAddReply,
}: {
  post: Post;
  onAddComment: (postId: string, content: string) => void;
  onReact: (
    postId: string,
    reactType: ReactType,
    currentAuthReaction?: ReactType,
  ) => void;
  onReactComment: (
    commentId: string,
    reactType: ReactType,
    currentAuthReaction?: ReactType,
  ) => void;
  onAddReply: (postId: string, parentId: string, content: string) => void;
}) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterReactions = () => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    setShowReactions(true);
  };

  const handleMouseLeaveReactions = () => {
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 200);
  };

  const user = post.user;
  const isEmployee = user.user_type === UserType.EMPLOYEE;

  const userName = isEmployee
    ? `${user.employee?.firstName} ${user.employee?.lastName}`
    : (user.company?.name ?? "Unknown");

  const userImage = isEmployee ? user.employee?.imgPath : user.company?.imgPath;
  const userPosition = isEmployee ? user.employee?.position?.title : undefined;

  const totalReactions =
    post.reactions?.reduce((sum, r) => sum + r.count, 0) ?? 0;

  const reactionsWithCount = post.reactions?.filter((r) => r.count > 0) ?? [];

  const getDefaultReaction = () => post.authReaction ?? ReactType.LIKE;

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText("");
    }
  };

  const handleOpenImageViewer = (index: number) => {
    const images = post.imagesPaths || [];
    const encodedImages = encodeURIComponent(JSON.stringify(images));
    router.push(
      `/feeds/${post.id}/image?index=${index}&images=${encodedImages}`,
    );
  };

  const renderImages = () => {
    const images = post.imagesPaths || [];
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer mb-4"
          onClick={() => handleOpenImageViewer(0)}
        >
          <Image
            src={`${BACKEND_URL}${images[0]}`}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
          {images.map((imagePath, idx) => (
            <div
              key={idx}
              className="relative aspect-square cursor-pointer"
              onClick={() => handleOpenImageViewer(idx)}
            >
              <Image
                src={`${BACKEND_URL}${imagePath}`}
                alt={`Post image ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
        <div
          className="relative row-span-2 aspect-[3/4] md:aspect-auto cursor-pointer"
          onClick={() => handleOpenImageViewer(0)}
        >
          <Image
            src={`${BACKEND_URL}${images[0]}`}
            alt="Post image 1"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div
          className="relative aspect-square cursor-pointer"
          onClick={() => handleOpenImageViewer(1)}
        >
          <Image
            src={`${BACKEND_URL}${images[1]}`}
            alt="Post image 2"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div
          className="relative aspect-square cursor-pointer"
          onClick={() => handleOpenImageViewer(2)}
        >
          <Image
            src={`${BACKEND_URL}${images[2]}`}
            alt="Post image 3"
            fill
            className="object-cover"
            unoptimized
          />
          {images.length > 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                +{images.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
    );
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
            <p className="font-semibold">
              {userName}
              {POST_TYPE_LABELS[post.type] && (
                <span className="font-normal text-gray-500">
                  {" "}
                  is {POST_TYPE_LABELS[post.type]}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500">
              {userPosition && `${userPosition} • `}
              {moment(post.created_at).fromNow()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.content}</p>

        {renderImages()}

        {totalReactions > 0 && (
          <div className="flex items-center gap-2 mb-3 relative z-0">
            <div className="flex -space-x-2">
              {reactionsWithCount.slice(0, 3).map((reaction, idx) => (
                <div
                  key={reaction.type}
                  className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center text-xs"
                  style={{ zIndex: 3 - idx }}
                  title={`${reaction.count} ${reaction.type}`}
                >
                  {REACTION_EMOJIS[reaction.type]}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">{totalReactions}</span>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnterReactions}
            onMouseLeave={handleMouseLeaveReactions}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onReact(post.id, getDefaultReaction(), post.authReaction)
              }
              className={cn(
                "text-lg px-3 py-1",
                post.authReaction && "text-blue-600 border-blue-400 bg-blue-50",
              )}
            >
              {REACTION_EMOJIS[getDefaultReaction()]}
              <span className="ml-1 text-sm">
                {post.authReaction ? post.authReaction : "Like"}
              </span>
            </Button>
            {showReactions && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-full shadow-lg border px-2 py-1 flex gap-1 z-50">
                {Object.values(ReactType).map((reactType) => (
                  <button
                    key={reactType}
                    onClick={() => {
                      onReact(post.id, reactType, post.authReaction);
                      setShowReactions(false);
                    }}
                    className={cn(
                      "text-xl p-1 hover:bg-gray-100 rounded-full transition-transform hover:scale-125",
                      post.authReaction === reactType && "bg-blue-50",
                    )}
                    title={reactType}
                  >
                    {REACTION_EMOJIS[reactType]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowComments(true)}
            className={cn(
              "text-lg px-3 py-1",
              showComments && "text-blue-600 border-blue-400 bg-blue-50",
            )}
          >
            <IconMessageCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">{post.comments.length}</span>
          </Button>
        </div>

        <div className="border-t pt-3">
          {showComments && (
            <>
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
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  {buildCommentTree(post.comments).map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      onReactComment={onReactComment}
                      onAddReply={onAddReply}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedsPage() {
  const { data, loading } = useQuery(GET_POSTS, {
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

  const router = useRouter();

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const [createReaction] = useMutation(CREATE_REACTION, {
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const [deleteReaction] = useMutation(DELETE_REACTION, {
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const [createCommentReaction] = useMutation(CREATE_COMMENT_REACTION, {
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const [deleteCommentReaction] = useMutation(DELETE_COMMENT_REACTION, {
    refetchQueries: [
      { query: GET_POSTS, variables: { pagination: { page: 1, limit: 20 } } },
    ],
  });

  const posts = data?.posts?.data ?? [];

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

  const handleReact = (
    postId: string,
    reactType: ReactType,
    currentAuthReaction?: ReactType,
  ) => {
    if (currentAuthReaction === reactType) {
      deleteReaction({
        variables: {
          postId,
        },
      });
    } else {
      createReaction({
        variables: {
          input: {
            postId,
            reactType,
          },
        },
      });
    }
  };

  const handleReactComment = (
    commentId: string,
    reactType: ReactType,
    currentAuthReaction?: ReactType,
  ) => {
    if (currentAuthReaction === reactType) {
      deleteCommentReaction({
        variables: {
          commentId,
        },
      });
    } else {
      createCommentReaction({
        variables: {
          input: {
            commentId,
            reactType,
          },
        },
      });
    }
  };

  const handleAddReply = (
    postId: string,
    parentId: string,
    content: string,
  ) => {
    createComment({
      variables: {
        input: {
          postId,
          parentId,
          content,
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Card>
          <CardContent className="pt-4">
            <button
              onClick={() => router.push("/feeds/create")}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
            >
              Start a post...
            </button>
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
              onReactComment={handleReactComment}
              onAddReply={handleAddReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
