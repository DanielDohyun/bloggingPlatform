"use client"; // This is a client component
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import firebase from '../utils/firebase';
import Comments from '../components/Comments';

interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

const MainPage: React.FC = () => {
  // const { currentUser } = useAuth();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  let initial;
  if (user?.displayName) {
    initial = user?.displayName[0].toUpperCase();
  }


  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postData);
      });

    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPost) {
      return;
    }

    try {
      await firebase.firestore().collection('posts').add({
        content: newPost,
        userId: user?.uid,
        useName: user?.displayName,
        createdAt: new Date(),
      });

      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();

    // Get the comment text from the form element
    const commentInput = e.currentTarget.querySelector(`#comment-input-${postId}`) as HTMLInputElement;
    const commentText = commentInput.value.trim();

    if (!commentText) {
      return;
    }

    try {
      await firebase.firestore().collection('comments').add({
        postId,
        content: commentText,
        userId: user?.uid,
        createdAt: new Date(),
      });

      commentInput.value = ''; // Clear the comment input field
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleLikeClick = async (postId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      // User not logged in, handle accordingly
      return;
    }

    const postRef = firebase.firestore().collection('posts').doc(postId);
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
      console.error('Error updating like:', error);
    }
  };

  return (
    <div>
      <Header />

      <div className="w-[80vw] md:w-[60vw] mx-auto pt-[120px]">
        {/* Create Post Section */}
        <section className='  md:max-w-md lg:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6'>
          <form className='flex' onSubmit={handlePostSubmit}>
            {initial ?
              <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">{initial}</span>
              </div> :
              <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
              </div>
            }

            <input
              className=' flex-1 bg-gray-200 rounded-full px-3 py-2 mx-3'
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your post here..."
            ></input>
            <button className='hidden sm:block bg-[#1877F2] text-white p-2 rounded' type="submit">Post</button>
          </form>
        </section>

        {/* Posts Section */}
          {posts.map((post: any) => (
            <div key={post.id} className="post max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-actions">
                {
                  post.likecount ?
                    <p>❤️ {post.likeCount}</p> :
                    <p>❤️ 0</p>
                }
                <button onClick={() => handleLikeClick(post.id)}>👍 Like</button>
              </div>

              <div className="comment-section">
                <Comments post={post} />
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

export default MainPage;