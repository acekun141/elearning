import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/rootReducer";
import thunk from "redux-thunk";

export default createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk)
));