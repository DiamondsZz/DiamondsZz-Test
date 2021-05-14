import {
  CategoryUnionType,
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS
} from "../actions/category.actions"
import { Category } from "../models/category"

export interface CategoryState {
  category: {
    loaded: boolean
    success: boolean
    result: Category[]
  }
}

const initialState: CategoryState = {
  category: {
    loaded: false,
    success: false,
    result: []
  }
}

export default function categoryReducer(
  state = initialState,
  action: CategoryUnionType
) {
  switch (action.type) {
    case GET_CATEGORY:
      return {
        ...state,
        category: {
          loaded: false,
          success: false,
          result: []
        }
      }
    case GET_CATEGORY_SUCCESS:
      return {
        ...state,
        category: {
          loaded: true,
          success: true,
          result: action.payload
        }
      }
    default:
      return state
  }
}
