import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as countActions from "../../store/actions/count.action";
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.props.countReduce}>-</button>
        {this.props.value}
        <button onClick={this.props.countAdd}>+</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  value: state.count.value,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(countActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
