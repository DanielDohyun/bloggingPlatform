"use client"; // This is a client component
import { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import ModalContext from "../context/modalContext";
import firebase from "../utils/firebase";
import Comments from "../components/Comments";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

interface DeleteProps {
  handleDeletePost: (id: string) => Promise<void>;
}

const Posts: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { confirmModalOpen, setConfirmModalOpen } = useContext(ModalContext);

  const [prevPost, setPrevPost] = useState<string>("");
  const [noPost, setNoPost] = useState<boolean>(false);

  let initial: string = "";
  if (user?.displayName) {
    initial = user?.displayName[0].toUpperCase();
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postData);
      });

    return () => unsubscribe();
  }, []);

  const handleUpdatePost = async (postId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      setIsModalOpen(true);
      // User not logged in, handle accordingly
      return;
    }

    const postRef = firebase.firestore().collection("posts").doc(editPostId);
    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      // Post doesn't exist, handle accordingly
      return;
    }

    if (prevPost === editedContent) {
      setEditPostId("");
      setEditedContent("");
      return;
    }

    try {
      // Update the post's content
      await postRef.update({
        content: editedContent,
      });

      // Clear the edit state
      setEditPostId("");
      setEditedContent("");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  //when user clicks delete btn => shows popup => yes => run handledeletepost

  const handleDeletePost = async (postId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      setIsModalOpen(true);
      // User not logged in, handle accordingly
      return;
    }

    const postRef = firebase.firestore().collection("posts").doc(postId);
    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      // Post doesn't exist, handle accordingly
      return;
    }

    const post = postSnapshot.data();
    const postUserId = post?.userId;

    if (user.uid !== postUserId) {
      // User is not the writer of the post, handle accordingly
      return;
    }

    try {
      // Delete the post
      await postRef.delete();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikeClick = async (postId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      setIsModalOpen(true);
      // User not logged in, handle accordingly
      return;
    }

    const postRef = firebase.firestore().collection("posts").doc(postId);
    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      // Post doesn't exist, handle accordingly
      return;
    }

    const post = postSnapshot.data();
    const previousLikes = post?.likes || [];
    const userHasLiked = previousLikes.includes(user.uid);

    try {
      let updatedLikes = [];

      if (userHasLiked) {
        // User has already liked the post, remove like
        updatedLikes = previousLikes.filter((userId) => userId !== user.uid);
      } else {
        // User hasn't liked the post, add like
        updatedLikes = [...previousLikes, user.uid];
      }

      await postRef.update({
        likes: updatedLikes,
      });

      // Update the post's like count
      const updatedPostSnapshot = await postRef.get();
      const updatedPost = updatedPostSnapshot.data();
      const likeCount = updatedPost?.likes ? updatedPost?.likes.length : 0;
      await postRef.update({
        likeCount,
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <>
      {/* Displaying the Posts */}
      {posts.map((post: any) => (
        <div
          key={post.id}
          className="post max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6"
        >
          {confirmModalOpen && <ConfirmDeleteModal />}
          {/* {confirmModalOpen && <ConfirmDeleteModal handleDeletePost={handleDeletePost(post.id)} />} */}

          <div className="post-content pb-3 ">
            <div>
              <div className="flex items-center mb-3 justify-between">
                <div className="flex items-center">
                  {initial ? (
                    <div className="hidden sm:flex relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {initial}
                      </span>
                    </div>
                  ) : (
                    <div className="hidden sm:flex relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg
                        className=" absolute w-12 h-12 text-gray-400 -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}
                  <p className="ml-3">{user?.displayName}</p>
                </div>

                {/* edit + delete icons */}
                <div>
                  {/* Edit Button */}
                  {user?.uid === post.userId && editPostId !== post.id ? (
                    <ModeEditIcon
                      onClick={() => {
                        setEditPostId(post.id);
                        setEditedContent(post.content);
                        setPrevPost(post.content);
                      }}
                    />
                  ) : // <button onClick={() => handleEditPost(post.id, post.content)}>Edit</button>
                  null}

                  {/* Update Button */}
                  {editPostId === post.id ? (
                    <button
                      disabled={editedContent.length === 0}
                      onClick={() => handleUpdatePost(post.id)}
                    >
                      Update
                    </button>
                  ) : null}
                  {user?.uid === post.userId && (
                    <DeleteOutlineIcon
                      onClick={() => setConfirmModalOpen(true)}
                      // onClick={() => handleDeletePost(post.id)}
                    />
                  )}
                </div>
              </div>
            </div>
            {editPostId === post.id && (
              <input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            )}
            {editPostId !== post.id && <p>{post.content}</p>}
          </div>
          <div className="post-actions border-y border-gray-200 py-3 mb-3">
            <p>❤️ {post.likeCount}</p>
            <button onClick={() => handleLikeClick(post.id)}>👍 Like</button>
          </div>

          <div className="comment-section">
            <Comments post={post} />
          </div>
        </div>
      ))}
    </>
  );
};

export default Posts;
