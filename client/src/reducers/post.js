import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from '../actions/types';

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
};

export default function postReducer(state = initialState, actions) {
    const { type, payload } = actions

    switch (type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case UPDATE_LIKES:
            //here we map through all the posts and for each post match the id of post and the ID that we sent via payload
            //if the ID matches that means we are adding/removing likes to correct post so update that post by adding prev data from post
            // and then adding likes array from payload which we sent, also if IDs does not match we return the same post 
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === payload.postId ? { ...post, likes: payload.likes } : post
                ),
                loading: false
            }
        default:
            return state
    }
}
