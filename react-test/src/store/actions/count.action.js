//add action
export const countAdd = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: "add" });
    }, 2000);
  };
};
//reduce action
export const countReduce = () => ({ type: "reduce" });
