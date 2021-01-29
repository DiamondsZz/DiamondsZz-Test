export const countReducer = (state = { value: 0 }, action) => {
  console.log(action.type);
  switch (action.type) {
    case "add":
      return { value: state.value + 1 };
    default:
      return state;
  }
};
