import { connectRouter, RouterState } from "connected-react-router"
import { combineReducers } from "redux"
import { History } from "history"
import authReducer from "./auth.reducer"
import { AuthState } from "./auth.reducer"
import categoryReducer from "./category.reducer"
import { CategoryState } from "./category.reducer"
import productReducer from "./product.reducer"
import { ProductState } from "./product.reducer"

export interface AppState {
  router: RouterState
  auth: AuthState
  category: CategoryState
  product: ProductState
}

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    category: categoryReducer,
    product: productReducer
  })

export default createRootReducer
