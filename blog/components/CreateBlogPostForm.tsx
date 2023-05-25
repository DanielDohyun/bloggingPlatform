import { useState } from 'react';
import firebase from '../utils/firebase';

const CreateBlogPostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        // Handle user not logged in
        return;
      }

      const postRef = firebase.firestore().collection('posts').doc();
      await postRef.set({
        title,
        content,
        authorId: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Blog post created');
      // Handle successful post creation
    } catch (error) {
      console.error('Error creating blog post:', error);
      // Handle post creation error
    }
  };

  return (
    <div>
      <h2>Create a Blog Post</h2>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreateBlogPostForm;