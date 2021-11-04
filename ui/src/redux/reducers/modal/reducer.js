import { SET_CREATE_COURSE_MODAL } from "./actionTypes"

const initializeState = {
  isShowCreateCourse: false
}

const modalReducer = (state=initializeState, action) => {
  switch(action.type) {
    case SET_CREATE_COURSE_MODAL: {
      return { ...state, isShowCreateCourse: action.payload };
    }
    default:
      return state;
  }
}

export default modalReducer;