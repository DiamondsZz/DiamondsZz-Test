import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
  }
  render() {
    return (
      <div className="App">
        <button>-</button>

        <button>+</button>
      </div>
    );
  }
}

export default App;
