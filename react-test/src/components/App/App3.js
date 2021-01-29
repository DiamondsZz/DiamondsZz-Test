import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as numActions from "../../store/actions/num.action";
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.props.reduceCount}>-</button>
        {this.props.value}
        <button onClick={this.props.addCount}>+</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  value: state.count.value,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(numActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
