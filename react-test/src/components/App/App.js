import React from "react";
import { createStore } from "redux";

function reducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "add":
      return { value: state.value + 1 };
    default:
      return state;
  }
}
const store = createStore(reducer);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.add = this.add.bind(this);
  }
  add() {
    store.dispatch({ type: "add" });
    this.setState(store.getState());
  }
  render() {
    return (
      <div className="App">
        <button>- </button>
        {this.state.value}
        <button onClick={this.add}>+</button>
      </div>
    );
  }
}

export default App;
