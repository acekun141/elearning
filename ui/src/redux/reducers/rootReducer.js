import { combineReducers } from "redux";
import userReducer from "./user/reducer";
import commonReducer from "./common/reducer";
import modalReducer from "./modal/reducer";

export default combineReducers({ user: userReducer, common: commonReducer, modal: modalReducer });