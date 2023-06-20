import { useState, useEffect, Dispatch, SetStateAction } from "react";
import firebase from "../utils/firebase";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import ModalContext from "../context/modalContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SendIcon from "@mui/icons-material/Send";

interface Comment {
  id: string;
  postId: string;
  content: string;
  userName: string;
  userId: string;
  createdAt: Date;
}

interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  useName: string;
}

const Comments: React.FC<{ post: Post }> = ({ post }) => {
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [curComment, setCurComment] = useState<string>('');
  const [editCommentId, setEditCommentId] = useState<string>("");
  const [editedCommentContent, setEditedCommentContent] = useState<string>("");
  const [prevComment, setPrevComment] = useState<string>("");
  const [noComment, setNoComment] = useState<boolean>(false);
  const { confirmModalOpen, setConfirmModalOpen } = useContext(ModalContext);
  const { isPost, setIsPost } = useContext(ModalContext);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("comments")
      .where("postId", "==", post.id)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        const commentData: Comment[] = [];
        snapshot.forEach((doc) => {
          commentData.push({
            id: doc.id,
            postId: doc.data().postId,
            content: doc.data().content,
            userName: doc.data().userName,
            userId: doc.data().userId,
            createdAt: doc.data().createdAt,
          });
        });
        setComments(commentData);
      });

    return () => unsubscribe();
  }, [post.id]);

  const handleCommentSubmit = async (
    // e: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    // e.preventDefault();

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    // Get the comment text from the form element
    // const commentInput = e.currentTarget.querySelector(
    //   `#comment-input-${postId}`
    // ) as HTMLInputElement;
    // const commentText = commentInput.value.trim();
    const commentText = curComment.trim();

    if (!commentText) {
      setNoComment(true);
      return;
    }
    try {
      await firebase.firestore().collection("comments").add({
        postId,
        content: commentText,
        userName: user?.displayName,
        userId: user?.uid,
        createdAt: new Date(),
      });

      // commentInput.value = ""; // Clear the comment input field
      setCurComment('');
      setNoComment(false);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleCommentEdit = async (commentId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      // User not logged in, handle accordingly
      return;
    }

    try {
      const commentRef = firebase
        .firestore()
        .collection("comments")
        .doc(commentId);
      const commentSnapshot = await commentRef.get();

      if (!commentSnapshot.exists) {
        // Comment doesn't exist, handle accordingly
        return;
      }

      if (prevComment === editedCommentContent) {
        setEditCommentId("");
        setEditedCommentContent("");
        return;
      }

      await commentRef.update({
        content: editedCommentContent,
      });

      setEditCommentId("");
      setEditedCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="commentContainer">
      {/* <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
       */}
      <form onSubmit={(e) => handleCommentSubmit(post.id)}>
        <div className="flex flex-col">
          <div className="flex items-center bg-gray-100  rounded-xl p-2">
            <input
              type="text"
              id={`comment-input-${post.id}`}
              onChange={(e) => setCurComment(e.target.value)}
              value={curComment}
              placeholder="Please enter a comment..."
              className="bg-gray-100  rounded-xl w-[100%] mr-2 text-xs border-none outline-none"
            />
            <SendIcon
              className=""
              onClick={(e) => {
                if (curComment.length !== 0) {
                  e.preventDefault();
                  console.log('submit')
                  // handleCommentSubmit(e, post.id)
                  handleCommentSubmit(post.id);

                }
              }}
            />
          </div>

          {noComment && (
            <p className="text-red-400 text-xs mt-2">
              ⛔️ Please write something
            </p>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          {confirmModalOpen && !isPost && (
            <ConfirmDeleteModal deletePostId={comment.id} isPost={false} />
          )}

          <div className="flex items-center space-x-2 mb-2">
            <div className="flex flex-shrink-0 self-start cursor-pointer">
              <div className="hidden sm:flex relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {post?.useName[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="block flex-1  ">
              <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
                <div className="font-medium">
                  <a href="#" className="hover:underline text-sm">
                    <small>{post?.useName}</small>
                  </a>
                </div>
                {editCommentId === comment.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="bg-gray-100  rounded-xl p-2 w-[100%] mr-2 text-xs border-none outline-none"
                      placeholder="Please enter a comment..."
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          editedCommentContent.length !== 0
                        ) {
                          e.preventDefault();
                          handleCommentEdit(comment.id);
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          setEditCommentId("");
                        }
                      }}
                    />
                    <SendIcon
                      className=""
                      onClick={(e) => {
                        if (editedCommentContent.length !== 0) {
                          e.preventDefault();
                          handleCommentEdit(comment.id);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-xs">{comment.content}</p>
                )}
              </div>
            </div>
          </div>

          {comment.userId === firebase.auth().currentUser?.uid && (
            <div className="comment-actions">
              {editCommentId === comment.id ? null : (
                <button
                  onClick={() => {
                    setEditCommentId(comment.id);
                    setEditedCommentContent(comment.content);
                    setPrevComment(comment.content);
                  }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => {
                  setConfirmModalOpen(true);
                  setIsPost(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
