import { userInfoService } from "../../../utils/api/user";
import { SET_USER_DETAIL } from "./actionTypes";
import { loadingOff, loadingOn } from "../common/action";
import { signUpService } from "../../../utils/api/auth";

export const getUserDetail = (callback=null) => async dispatch => {
  dispatch(loadingOn());
  const { res, err } = await userInfoService();
  dispatch({ type: SET_USER_DETAIL, payload: res });
  dispatch(loadingOff());
  if (typeof(callback) === "function") callback(res, err);
}

export const signUp = (email, pw, firstName, lastName, callback=null) => async dispatch => {
  dispatch(loadingOn())
  const { res, err } = await signUpService(email, pw, firstName, lastName);
  dispatch(loadingOff());
  if (typeof(callback) === "function") callback(res, err);
}