import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

function alertReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            //adding previous state and then the new payload to array
            return [...state, payload];
        case REMOVE_ALERT:
            //returning all alerts except for a particular ID alert which we want to remove
            return state.filter((alert) => alert.id !== payload);
        default:
            //every reducer will have default as return state
            return state;
    }
}

export default alertReducer;