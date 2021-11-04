import { SET_USER_DETAIL } from "./actionTypes";

const initializeState = null;

const userReducer = (state=initializeState, action) => {
  switch(action.type) {
    case SET_USER_DETAIL: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default userReducer;