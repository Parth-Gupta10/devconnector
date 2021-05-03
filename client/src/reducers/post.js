import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from '../actions/types';

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
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            };
        case DELETE_POST:
            //return all posts whose id does NOT match with the ID of post sent via payload i.e the post to be deleted
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            };
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
        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false
            };
        case REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(
                        comment => comment._id !== payload
                    )
                },
                loading: false
            };
        default:
            return state
    }
}
