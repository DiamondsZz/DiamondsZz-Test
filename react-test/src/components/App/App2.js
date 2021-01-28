import React from "react";
import { connect } from "react-redux";
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <button>-</button>
        {this.props.value}
        <button onClick={this.props.add}>+</button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  value: state.value,
});
const mapDispatchToProps = (dispatch) => ({
  add() {
    dispatch({ type: "add" });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
