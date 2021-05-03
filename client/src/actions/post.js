import axios from 'axios'
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from './types';

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
