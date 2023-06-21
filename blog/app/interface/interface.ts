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

export interface StateProps {
  // setEditCommentId: React.Dispatch<React.SetStateAction<string>>;
  setEditCommentId: React.Dispatch<React.SetStateAction<string>>;
  setEditedCommentContent: React.Dispatch<React.SetStateAction<string>>;
  setPrevComment: React.Dispatch<React.SetStateAction<string>>;
  setConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CommentProps extends StateProps {
  id: string;
  content: string;
}
