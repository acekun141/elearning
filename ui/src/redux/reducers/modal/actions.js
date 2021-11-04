import { SET_CREATE_COURSE_MODAL } from "./actionTypes"


export const setCreateSourceModal = (value) => dispatch => {
  dispatch({ type: SET_CREATE_COURSE_MODAL, payload: value });
}