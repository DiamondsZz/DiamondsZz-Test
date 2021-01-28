import { createStore } from "redux";
function reducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "add":
      return { value: state.value + 1 };
    default:
      return state;
  }
}
export const store = createStore(reducer);
