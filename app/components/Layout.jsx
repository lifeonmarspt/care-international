import React from "react";

import Map from "components/areas/map";
import Sidebar from "components/areas/sidebar";

class Layout extends React.Component {

  render() {
    return (<div id="app">
      <Map />
      <Sidebar />
    </div>);
  }
}

export default Layout;
