"use client"; // This is a client component
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import firebase from '../utils/firebase';

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
    try {
      // Implement your logic to handle liking a post
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div>
      <Header />

      {/* Create Post Section */}
      <section className='pt-[80px]'>
        <h2>Create a Post</h2>
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write your post here..."
          ></textarea>
          <button type="submit">Post</button>
        </form>
      </section>

      {/* Posts Section */}
      <section>
        <h2>Posts</h2>
        {posts.map((post: any) => (
          <div key={post.id} className="post">
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-actions">
              <button onClick={() => handleLikeClick(post.id)}>Like</button>
            </div>
            <div className="comment-section">
              <h3>Comments</h3>
              {/* Display comments for the post */}
              {/* ... */}
              <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                <input type="text" id={`comment-input-${post.id}`} placeholder="Write a comment..." />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MainPage;