import { createStore,applyMiddleware } from "redux";
import thunk from "redux-thunk"
import {rootReducer} from "./reducers/root.reducer"
export const store = createStore(rootReducer,applyMiddleware(thunk));
