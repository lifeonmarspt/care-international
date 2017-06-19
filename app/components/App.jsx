import React from "react";

import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";

class App extends React.Component {

  render() {
    return (<div id="app">
      <Sidebar />
      <Map />
    </div>);
  }
}

export default App;
