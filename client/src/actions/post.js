import axios from 'axios';
import setAlert from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST } from './types';

// Get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/posts/like/${postId}`);

        // as the payload we will send both array of likes and post ID
        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/posts/unlike/${postId}`);

        // as the payload we will send both array of likes and post ID
        dispatch({
            type: UPDATE_LIKES,
            payload: { postId, likes: res.data }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete post
export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`/posts/${postId}`);

        //sending post ID only as payload because we need to just "filter" the posts to delete it
        dispatch({
            type: DELETE_POST,
            payload: postId
        });

        dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post('/posts', formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data
        });

        dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};