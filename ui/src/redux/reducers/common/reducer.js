import { LOADING_OFF, LOADING_ON, SET_LANDING_INFO } from "./actionTypes";

const initializeState = {
  isLoading: false,
  landingInfo: {}
}

const commonReducer = (state=initializeState, action) => {
  switch (action.type) {
    case LOADING_ON: {
      return { ...state, isLoading: true };
    }
    case LOADING_OFF: {
      return { ...state, isLoading: false };
    }
    case SET_LANDING_INFO: {
      return { ...state, landingInfo: action.payload};
    }
    default:
      return state;
  }
}

export default commonReducer;