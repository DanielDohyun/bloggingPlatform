export interface Comment {
  id: string;
  postId: string;
  content: string;
  userName: string;
  userId: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  useName: string;
}

export interface CommentProps {
  commentId: string;
  commentContent: string;
  setEditCommentId: React.Dispatch<React.SetStateAction<string>>;
  setEditedCommentContent: React.Dispatch<React.SetStateAction<string>>;
  setPrevComment: React.Dispatch<React.SetStateAction<string>>;
  setDeleteCommentId: React.Dispatch<React.SetStateAction<string>>;
}
