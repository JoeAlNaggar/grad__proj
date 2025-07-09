"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getImageUrl } from "@/app/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Zap,
  MoreHorizontal,
  Edit,
  Save,
  X,
  Trash2,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  reactToPost,
  savePost,
  sharePost,
  commentOnPost,
  editPost,
  deletePost,
  editComment,
  deleteComment,
  type Post,
  type Comment,
} from "@/app/services/api";
import { toast } from "sonner";

interface CardProps extends Post {
  onUpdate?: (updatedPost: Post) => void;
  onDelete?: (postId: string) => void;
  showTruncated?: boolean; // Controls whether to show truncated content with "See more"
}

// Updated reaction icons for the new three reactions
const reactionIcons = {
  Thunder: Zap,
  Love: Heart,
  Dislike: ThumbsDown,
};

interface Author {
  username: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  avatar?: string;
  profile_image?: string;
}

interface ProfileImageProps {
  src?: string;
  alt: string;
  className: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, alt, className }) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || "/placeholder-user.jpg");

  useEffect(() => {
    setImgSrc(src || "/placeholder-user.jpg");
    setImgError(false);
  }, [src]);

  const handleImageError = () => {
    if (!imgError && imgSrc !== "/placeholder-user.jpg") {
      setImgError(true);
      setImgSrc("/placeholder-user.jpg");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
};

export default function Card({
  id,
  author,
  post_type,
  title,
  content,
  image,
  tags,
  created_at,
  trend,
  comments_count,
  shares_count,
  reacts_count,
  saves_count,
  comments,
  user_reaction,
  is_shared,
  is_saved,
  reactions,
  onUpdate,
  onDelete,
  showTruncated = false, // Default to false (full content)
}: CardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments || []);
  const [localReactions, setLocalReactions] = useState({
    Thunder: reactions?.Thunder || 0,
    Love: reactions?.Love || 0,
    Dislike: reactions?.Dislike || 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(
    user_reaction || null
  );
  const [localIsSaved, setLocalIsSaved] = useState(is_saved || false);
  const [localSharesCount, setLocalSharesCount] = useState(shares_count || 0);
  const [localReactsCount, setLocalReactsCount] = useState(reacts_count || 0);
  const [localSavesCount, setLocalSavesCount] = useState(saves_count || 0);
  const [localIsShared, setLocalIsShared] = useState(is_shared || false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Image editing states
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [keepCurrentImage, setKeepCurrentImage] = useState(true);

  // Comment editing states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);

  // Content truncation state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if current user is the author (compare with username)
  const currentUser = user?.username || "";
  const isAuthor =
    currentUser === (typeof author === "string" ? author : author.username);

  // Content truncation helpers
  const getContentLimits = () => {
    if (!showTruncated) return { shouldTruncate: false, displayContent: content };
    
    // Determine line limits based on image presence
    const lineLimit = image ? 1 : 4;
    const approxCharsPerLine = 42; // Approximate characters per line
    const charLimit = lineLimit * approxCharsPerLine;
    
    const shouldTruncate = content && content.length > charLimit;
    const displayContent = shouldTruncate 
      ? content.substring(0, charLimit).trim() + '...'
      : content;
      
    return { shouldTruncate, displayContent };
  };

  const { shouldTruncate, displayContent } = getContentLimits();

  const handleSeeMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/community/post/${id}`;
  };

  // Calculate total reactions from individual counts
  const totalReactions =
    localReactions.Thunder + localReactions.Love + localReactions.Dislike;
  const commentsCount = localComments.length;

  // Helper function to get author display information
  const getAuthorDisplayInfo = () => {
    if (typeof author === "string") {
      // Legacy format - author is just username
      if (user && user.username === author) {
        return {
          fullName:
            `${user.first_name} ${user.last_name}`.trim() || "Unknown User",
          username: user.username,
          profilePicture: user.profile_picture,
        };
      }
      return {
        fullName: author,
        username: author,
        profilePicture: undefined,
      };
    } else {
      // New format - author is an object with complete metadata
      return {
        fullName:
          `${author.first_name} ${author.last_name}`.trim() || author.username,
        username: author.username,
        profilePicture: author.profile_picture,
      };
    }
  };

  // Helper function to get full name for comments (they have complete author object)
  const getFullName = (user: { first_name: string; last_name: string }) => {
    return `${user.first_name} ${user.last_name}`.trim() || "Unknown User";
  };

  // Handle image change in edit mode
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file size must be less than 10MB");
        return;
      }

      setEditImage(file);
      setKeepCurrentImage(false);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove edit image
  const removeEditImage = () => {
    setEditImage(null);
    setEditImagePreview(null);
    setKeepCurrentImage(false);
  };

  // Reset edit image to current
  const resetToCurrentImage = () => {
    setEditImage(null);
    setEditImagePreview(null);
    setKeepCurrentImage(true);
  };

  const handleReaction = async (
    reactionType: "Love" | "Dislike" | "Thunder"
  ) => {
    try {
      // Optimistic update
      let newReactsCount = localReactsCount;
      let newReactions = { ...localReactions };

      // If user already reacted with this type, remove it
      if (userReaction === reactionType) {
        newReactsCount = Math.max(0, newReactsCount - 1);
        newReactions[reactionType] = Math.max(
          0,
          newReactions[reactionType] - 1
        );
        setUserReaction(null);
      } else {
        // If user had no reaction before, increment count
        if (!userReaction) {
          newReactsCount = newReactsCount + 1;
          newReactions[reactionType] = newReactions[reactionType] + 1;
        } else {
          // User had different reaction, decrement old and increment new
          newReactions[userReaction as keyof typeof newReactions] = Math.max(
            0,
            newReactions[userReaction as keyof typeof newReactions] - 1
          );
          newReactions[reactionType] = newReactions[reactionType] + 1;
        }
        setUserReaction(reactionType);
      }

      setLocalReactsCount(newReactsCount);
      setLocalReactions(newReactions);

      // Make API call
      const updatedPost = await reactToPost(id, reactionType);

      // Update with server response
      setLocalReactsCount(updatedPost.reacts_count || 0);
      setUserReaction(updatedPost.user_reaction || null);
      if (updatedPost.reactions) {
        setLocalReactions({
          Thunder: updatedPost.reactions.Thunder || 0,
          Love: updatedPost.reactions.Love || 0,
          Dislike: updatedPost.reactions.Dislike || 0,
        });
      }

      // Notify parent component
      if (onUpdate) {
        onUpdate(updatedPost);
      }

      // Show success toast
      const reactionNames = {
        Love: "loved",
        Dislike: "disliked",
        Thunder: "thundered",
      };

      if (userReaction === reactionType) {
        // Removed reaction
        toast.info(`Removed your ${reactionType.toLowerCase()} reaction`, {
          duration: 2000,
        });
      } else {
        // Added reaction
        toast.success(`You ${reactionNames[reactionType]} this post!`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error reacting to post:", error);
      // Revert optimistic update on error
      setLocalReactsCount(reacts_count || 0);
      setUserReaction(user_reaction || null);
      setLocalReactions({
        Thunder: reactions?.Thunder || 0,
        Love: reactions?.Love || 0,
        Dislike: reactions?.Dislike || 0,
      });
      toast.error("Failed to update reaction", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      const newSavedState = !localIsSaved;
      setLocalIsSaved(newSavedState);

      // Update saves count optimistically
      const newSavesCount = newSavedState
        ? localSavesCount + 1
        : Math.max(0, localSavesCount - 1);
      setLocalSavesCount(newSavesCount);

      const updatedPost = await savePost(id);
      setLocalIsSaved(updatedPost.is_saved || false);
      setLocalSavesCount(updatedPost.saves_count || 0);

      if (onUpdate) {
        onUpdate(updatedPost);
      }

      // Show toast notification
      if (updatedPost.is_saved) {
        toast.success("Post saved!", {
          description: "You can find saved posts in your profile",
          duration: 3000,
        });
      } else {
        toast.info("Post unsaved", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setLocalIsSaved(is_saved || false); // Revert on error
      setLocalSavesCount(saves_count || 0);
      toast.error("Failed to save post", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    // If already shared, just copy link to clipboard without API call
    if (localIsShared) {
      try {
        const postUrl = `${window.location.origin}/community/post/${id}`;
        await navigator.clipboard.writeText(postUrl);
        toast.success("Link copied to clipboard!", {
          duration: 2000,
        });
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy link", {
          duration: 2000,
        });
      }
      return;
    }

    try {
      // Optimistic update
      setLocalIsShared(true);
      setLocalSharesCount(localSharesCount + 1);

      const updatedPost = await sharePost(id);
      setLocalIsShared(updatedPost.is_shared || false);
      setLocalSharesCount(updatedPost.shares_count || 0);

      if (onUpdate) {
        onUpdate(updatedPost);
      }

      // Copy link to clipboard
      const postUrl = `${window.location.origin}/community/post/${id}`;
      await navigator.clipboard.writeText(postUrl);

      toast.success("Post shared and link copied!", {
        description: "The link has been copied to your clipboard",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error sharing post:", error);
      setLocalIsShared(is_shared || false); // Revert on error
      setLocalSharesCount(shares_count || 0);
      toast.error("Failed to share post", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const commentData = { content: newComment.trim() };
      const newCommentResponse = await commentOnPost(id, commentData);

      // Add the new comment to the local state
      setLocalComments((prev) => [...prev, newCommentResponse]);
      setNewComment("");

      toast.success("Comment posted successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const editData: any = {
        title: editTitle.trim() || undefined,
        content: editContent.trim(),
      };

      // Handle image editing
      if (editImage) {
        editData.image = editImage;
      } else if (!keepCurrentImage) {
        // User wants to remove the current image
        editData.image = null;
      }
      // If keepCurrentImage is true and no new image, don't include image in the request

      const updatedPost = await editPost(id, editData);

      // Update local state with edited content
      if (onUpdate) {
        onUpdate(updatedPost);
      }

      setIsEditing(false);
      toast.success("Post updated successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Failed to update post", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title || "");
    setEditContent(content);
    setEditImage(null);
    setEditImagePreview(null);
    setKeepCurrentImage(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(id);
      toast.success("Post deleted successfully!", {
        duration: 2000,
      });

      // Notify parent component to remove this post from the list
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getReactionCountsText = () => {
    if (totalReactions === 0) return "";
    if (totalReactions === 1) return "1 reaction";
    return `${totalReactions} reactions`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleTimestampClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/community/post/${id}`, "_self");
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/profile/${authorDisplayInfo.username}`, "_self");
  };

  // Comment edit/delete handlers
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveEditComment = async () => {
    if (!editingCommentId || !editCommentContent.trim() || isEditingComment)
      return;

    setIsEditingComment(true);
    try {
      const updatedComment = await editComment(
        editingCommentId,
        editCommentContent.trim()
      );

      // Update the comment in local state
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment.id === editingCommentId ? updatedComment : comment
        )
      );

      setEditingCommentId(null);
      setEditCommentContent("");

      toast.success("Comment updated successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to update comment", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId || isDeletingComment) return;

    setIsDeletingComment(true);
    try {
      await deleteComment(deletingCommentId);

      // Remove the comment from local state
      setLocalComments((prev) =>
        prev.filter((comment) => comment.id !== deletingCommentId)
      );

      toast.success("Comment deleted successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment", {
        description: "Please try again",
        duration: 3000,
      });
    } finally {
      setIsDeletingComment(false);
      setShowDeleteCommentDialog(false);
      setDeletingCommentId(null);
    }
  };

  // Check if current user is the comment author
  const isCommentAuthor = (comment: Comment) => {
    return currentUser === comment.author.username;
  };

  // Get display info for the post author
  const authorDisplayInfo = getAuthorDisplayInfo();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-lg min-h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <ProfileImage
            src={authorDisplayInfo.profilePicture || `/placeholder-user.jpg`}
            alt={authorDisplayInfo.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p 
              className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
              onClick={handleAuthorClick}
            >
              {authorDisplayInfo.fullName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{authorDisplayInfo.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span
                className="cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 hover:underline"
                onClick={handleTimestampClick}
              >
                {formatTimeAgo(created_at)}
              </span>
              {trend && (
                <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs rounded-full">
                  Trending
                </span>
              )}
            </p>
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-4 mb-4 flex-1">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Post title (optional)"
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="What's your content?"
            rows={4}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white whitespace-pre-wrap"
          />

          {/* Image editing section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>

            {/* Show image with red X button if there's an image (current or new) */}
            {((image && keepCurrentImage) || editImagePreview) && (
              <div className="relative inline-block">
                <img
                  src={editImagePreview || image || ""}
                  alt={editImagePreview ? "New image preview" : "Current image"}
                  className="max-w-sm max-h-64 rounded-lg border border-gray-300 dark:border-gray-600 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setEditImage(null);
                    setEditImagePreview(null);
                    setKeepCurrentImage(false);
                  }}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Show file input when no image is displayed */}
            {(!image || !keepCurrentImage) && !editImagePreview && (
              <Input
                id={`edit-image-${id}`}
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              disabled={isSaving || !editContent.trim()}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex-1">
          {title && (
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          <div className="text-gray-800 dark:text-gray-200 mb-3">
            <p className="whitespace-pre-wrap">{displayContent}</p>
            {shouldTruncate && (
              <button
                onClick={handleSeeMore}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium text-sm mt-2 cursor-pointer hover:underline"
              >
                See more
              </button>
            )}
          </div>

          {/* Image if present */}
          {image && (
            <img
              src={image}
              alt="Post image"
              className="w-full rounded-lg mb-3 max-h-96 object-fill h-[110px]"
            />
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            console.log(tags),
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-400 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Type Badge */}
          <div className="mb-3">
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                post_type === "blog"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                  : post_type === "question"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : post_type === "event"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {post_type.charAt(0).toUpperCase() + post_type.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
        {/* Reactions */}
        <div className="flex items-center space-x-1">
          {Object.entries(reactionIcons).map(([reaction, Icon]) => {
            const isActive = userReaction === reaction;
            const count =
              localReactions[reaction as keyof typeof localReactions];

            // Define colors for each reaction type
            const getReactionColors = (
              reactionType: string,
              active: boolean
            ) => {
              switch (reactionType) {
                case "Thunder":
                  return active
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400";
                case "Love":
                  return active
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400";
                case "Dislike":
                  return active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400";
                default:
                  return "text-gray-600 dark:text-gray-400";
              }
            };

            return (
              <Button
                key={reaction}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(reaction as "Love" | "Dislike" | "Thunder");
                }}
                className={`flex items-center space-x-1 hover:bg-transparent ${getReactionColors(
                  reaction,
                  isActive
                )}`}
                style={{ boxShadow: "none" }}
              >
                <Icon className={`w-4 h-4 ${isActive ? "fill-current" : ""}`} />
                {count > 0 && <span className="text-sm">{count}</span>}
              </Button>
            );
          })}
        </div>

        {/* Other Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-transparent"
            style={{ boxShadow: "none" }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{commentsCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className={`flex items-center space-x-1 hover:bg-transparent ${
              localIsShared
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            }`}
            style={{ boxShadow: "none" }}
          >
            <Share2 className="w-4 h-4" />
            {localSharesCount > 0 && (
              <span className="text-sm">{localSharesCount}</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`flex items-center space-x-1 hover:bg-transparent ${
              localIsSaved
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
            }`}
            style={{ boxShadow: "none" }}
          >
            <Bookmark
              className={`w-4 h-4 ${localIsSaved ? "fill-current" : ""}`}
            />
            {localSavesCount > 0 && (
              <span className="text-sm">{localSavesCount}</span>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      {(totalReactions > 0 || commentsCount > 0) && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {totalReactions > 0 && (
                <span className="font-medium">{getReactionCountsText()}</span>
              )}
              {commentsCount > 0 && (
                <span>
                  {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
                </span>
              )}
              {localSharesCount > 0 && (
                <span>
                  {localSharesCount} share{localSharesCount !== 1 ? "s" : ""}
                </span>
              )}
              {localSavesCount > 0 && (
                <span>
                  {localSavesCount} save{localSavesCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          {/* Comment Input */}
          <div className="flex items-center space-x-2 mb-4">
            <ProfileImage
              src={user?.profile_picture || `/placeholder-user.jpg`}
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex space-x-2">
              <Input
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComment();
                }}
                disabled={!newComment.trim() || isCommenting}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isCommenting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {localComments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <ProfileImage
                  src={
                    comment.author.profile_picture ||
                    comment.author.avatar ||
                    comment.author.profile_image ||
                    `/placeholder-user.jpg`
                  }
                  alt={getFullName(comment.author)}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {getFullName(comment.author)}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        @{comment.author.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>

                    {/* Comment Actions Menu - Only show for comment author */}
                    {isCommentAuthor(comment) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditComment(comment);
                            }}
                            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Comment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingCommentId(comment.id);
                              setShowDeleteCommentDialog(true);
                            }}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Comment Content or Edit Form */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        placeholder="Edit your comment..."
                        rows={3}
                        className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white text-sm"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEditComment}
                          disabled={isEditingComment}
                          className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveEditComment}
                          disabled={
                            !editCommentContent.trim() || isEditingComment
                          }
                          className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          {isEditingComment ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog
        open={showDeleteCommentDialog}
        onOpenChange={setShowDeleteCommentDialog}
      >
        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Comment</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteCommentDialog(false);
                setDeletingCommentId(null);
              }}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={isDeletingComment}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingComment ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
