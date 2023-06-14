import { useState, useEffect } from 'react';
import firebase from '../utils/firebase';

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

const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>, postId: string) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;
  if (!user) {
    // User not logged in, handle accordingly
    return;
  }

  const commentInput = e.currentTarget[`comment-input-${postId}`] as HTMLInputElement;
  const commentContent = commentInput.value.trim();
  if (commentContent === '') {
    // Comment content is empty, handle accordingly
    return;
  }

  try {
    await firebase.firestore().collection('comments').add({
      postId,
      content: commentContent,
      userName: user?.displayName,
      userId: user?.uid,
      createdAt: new Date(),
    });

    commentInput.value = ''; // Clear the comment input field
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

const Comments: React.FC<{ post: Post }> = ({ post }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [editCommentId, setEditCommentId] = useState<string>('');
    const [editedCommentContent, setEditedCommentContent] = useState<string>('');
  
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
  
        const comment = commentSnapshot.data();
        if (comment?.userId !== user.uid) {
          // User doesn't own the comment, handle accordingly
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
                <button onClick={() => handleCommentEdit(comment.id)}>Save</button>
                <button onClick={() => setEditCommentId('')}>Cancel</button>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
            {comment.userId === firebase.auth().currentUser?.uid && (
              <div className="comment-actions">
                {editCommentId === comment.id ? null : (
                  <button onClick={() => {setEditCommentId(comment.id); setEditedCommentContent(comment.content)}}>Edit</button>
                )}
                <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
          <input
            type="text"
            id={`comment-input-${post.id}`}
            placeholder="Write a comment..."
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };

export default Comments;
