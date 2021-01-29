export const countReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case "add":
      return { value: state.value + 1 };
    case "reduce":
      return { value: state.value - 1 };
    default:
      return state;
  }
};
