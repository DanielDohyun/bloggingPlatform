// utils/firebaseAPI.js
import firebase from './firebase';

export const createBlogPost = async (blogPostData) => {
  try {
    const db = firebase.firestore();
    const blogPostsRef = db.collection('blogPosts');
    const newBlogPostRef = await blogPostsRef.add(blogPostData);
    const newBlogPost = await newBlogPostRef.get();
    return { id: newBlogPostRef.id, ...newBlogPost.data() };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const db = firebase.firestore();
    const commentsRef = db.collection('comments');
    const newCommentRef = await commentsRef.add(commentData);
    const newComment = await newCommentRef.get();
    return { id: newCommentRef.id, ...newComment.data() };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const toggleLike = async (postId, userId) => {
  try {
    const db = firebase.firestore();
    const likesRef = db.collection('likes').doc(postId);
    const likeSnapshot = await likesRef.get();
    const isLiked = likeSnapshot.exists && likeSnapshot.data().likes.includes(userId);

    if (isLiked) {
      await likesRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(userId),
      });
    } else {
      await likesRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(userId),
      });
    }

    return !isLiked;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};