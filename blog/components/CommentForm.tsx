import { useState } from 'react';
import firebase from '../utils/firebase';

interface CommentFormProps {
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [comment, setComment] = useState('');

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        // Handle user not logged in
        return;
      }

      const commentRef = firebase.firestore().collection('comments').doc();
      await commentRef.set({
        postId,
        content: comment,
        authorId: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Comment created');
      // Handle successful comment creation
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      // Handle comment creation error
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateComment}>
        <textarea
          placeholder="Write a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentForm;