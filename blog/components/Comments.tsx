import { useState, useEffect, Dispatch, SetStateAction } from "react";
import firebase from "../utils/firebase";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import ModalContext from "../context/modalContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

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
}

const Comments: React.FC<{ post: Post }> = ({ post }) => {
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[]>([]);
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
    e: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    e.preventDefault();

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    // Get the comment text from the form element
    const commentInput = e.currentTarget.querySelector(
      `#comment-input-${postId}`
    ) as HTMLInputElement;
    const commentText = commentInput.value.trim();

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

      commentInput.value = ""; // Clear the comment input field
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
      <h3>Comments</h3>

      <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
        <div className="flex flex-col">
          <input
            type="text"
            id={`comment-input-${post.id}`}
            placeholder="Write a comment..."
          />
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
          <p>{comment?.userName}</p>
          {editCommentId === comment.id ? (
            <div>
              <input
                type="text"
                value={editedCommentContent}
                onChange={(e) => setEditedCommentContent(e.target.value)}
              />
              <button
                disabled={editedCommentContent.length === 0}
                type="submit"
                onClick={() => handleCommentEdit(comment.id)}
              >
                Save
              </button>
              <button onClick={() => setEditCommentId("")}>Cancel</button>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
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

              {/* comment section style  */}
      <div className="flex items-center space-x-2">
        <div className="flex flex-shrink-0 self-start cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1609349744982-0de6526d978b?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDU5fHRvd0paRnNrcEdnfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt=""
            className="h-8 w-8 object-cover rounded-full"
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="block">
            <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
              <div className="font-medium">
                <a href="#" className="hover:underline text-sm">
                  <small>Arkadewi</small>
                </a>
              </div>
              <div className="text-xs">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Expedita, maiores!
              </div>
            </div>
            <div className="flex justify-start items-center text-xs w-full">
              <div className="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
                <a href="#" className="hover:underline">
                  <small>Like</small>
                </a>
                <small className="self-center">.</small>
                <a href="#" className="hover:underline">
                  <small>Reply</small>
                </a>
                <small className="self-center">.</small>
                <a href="#" className="hover:underline">
                  <small>15 hour</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
