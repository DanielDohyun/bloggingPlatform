import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import firebase from '../utils/firebase';
import { useContext } from 'react';
import AuthContext from '../context/authContext';
import ModalContext from '../context/modalContext';

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
  const [editCommentId, setEditCommentId] = useState<string>('');
  const [editedCommentContent, setEditedCommentContent] = useState<string>('');
  const [prevComment, setPrevComment] = useState<string>('');
  const [noComment, setNoComment] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('comments')
      .where('postId', '==', post.id)
      .orderBy('createdAt', 'asc')
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

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>, postId: string) => {
    e.preventDefault();

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    // Get the comment text from the form element
    const commentInput = e.currentTarget.querySelector(`#comment-input-${postId}`) as HTMLInputElement;
    const commentText = commentInput.value.trim();

    if (!commentText) {
      setNoComment(true);
      return;
    }
    try {
      await firebase.firestore().collection('comments').add({
        postId,
        content: commentText,
        userName: user?.displayName,
        userId: user?.uid,
        createdAt: new Date(),
      });

      commentInput.value = ''; // Clear the comment input field
      setNoComment(false);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      // User not logged in, handle accordingly
      return;
    }

    try {
      const commentRef = firebase.firestore().collection('comments').doc(commentId);
      const commentSnapshot = await commentRef.get();

      if (!commentSnapshot.exists) {
        // Comment doesn't exist, handle accordingly
        return;
      }

      const comment = commentSnapshot.data();
      if (comment?.userId !== user.uid) {
        // User doesn't own the comment, handle accordingly
        return;
      }

      await commentRef.delete();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentEdit = async (commentId: string) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      // User not logged in, handle accordingly
      return;
    }

    try {
      const commentRef = firebase.firestore().collection('comments').doc(commentId);
      const commentSnapshot = await commentRef.get();

      if (!commentSnapshot.exists) {
        // Comment doesn't exist, handle accordingly
        return;
      }

      if (prevComment === editedCommentContent) {
        setEditCommentId('');
        setEditedCommentContent('');
        return;
      }

      await commentRef.update({
        content: editedCommentContent,
      });

      setEditCommentId('');
      setEditedCommentContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="commentContainer">
      <h3>Comments</h3>

      <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
        <div className='flex flex-col'>
          <input
            type="text"
            id={`comment-input-${post.id}`}
            placeholder="Write a comment..."
          />
          {
            noComment &&
            <p className='text-red-400 text-xs mt-2'>⛔️ Please write something</p>

          }
        </div>

        <button type="submit">Submit</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p>{comment?.userName}</p>
          {editCommentId === comment.id ? (
            <div>
              <input
                type="text"
                value={editedCommentContent}
                onChange={(e) => setEditedCommentContent(e.target.value)}
              />
              <button disabled={editedCommentContent.length === 0} type='submit' onClick={() => handleCommentEdit(comment.id)}>Save</button>
              <button onClick={() => setEditCommentId('')}>Cancel</button>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
          {comment.userId === firebase.auth().currentUser?.uid && (
            <div className="comment-actions">
              {editCommentId === comment.id ? null : (
                <button onClick={() => { setEditCommentId(comment.id); setEditedCommentContent(comment.content); setPrevComment(comment.content) }}>Edit</button>
              )}
              <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

    </div>
  );
};

export default Comments;
