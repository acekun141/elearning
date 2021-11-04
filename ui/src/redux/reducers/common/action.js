import { LOADING_OFF, LOADING_ON, SET_LANDING_INFO } from "./actionTypes";

export const loadingOn = () => dispatch => {
  dispatch({ type: LOADING_ON });
};

export const loadingOff = () => dispatch => {
  dispatch({ type: LOADING_OFF });
};

export const setLandingInfo = (data) => dispatch => {
  dispatch({ type: SET_LANDING_INFO, payload: data });
};