import { useState, useEffect } from 'react';
import firebase from '../utils/firebase';

interface LikeButtonProps {
  postId: string;
  userId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, userId }) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesRef = firebase.firestore().collection('likes').doc(postId);
        const likesSnapshot = await likesRef.get();
        const likesData = likesSnapshot.data();
        if (likesData && likesData.userIds.includes(userId)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
        // Handle error
      }
    };

    fetchLikes();
  }, [postId, userId]);

  const handleLike = async () => {
    try {
      const likesRef = firebase.firestore().collection('likes').doc(postId);
      if (isLiked) {
        await likesRef.update({
          userIds: firebase.firestore.FieldValue.arrayRemove(userId),
        });
        setIsLiked(false);
      } else {
        await likesRef.update({
          userIds: firebase.firestore.FieldValue.arrayUnion(userId),
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={handleLike}>{isLiked ? 'Unlike' : 'Like'}</button>
    </div>
  );
};

export default LikeButton;