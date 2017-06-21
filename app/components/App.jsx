import React from "react";
import PropTypes from "prop-types";

import Header from "components/areas/Header";
import Map from "components/areas/Map";
import Sidebar from "components/areas/Sidebar";
import Data from "components/providers/Data";

class App extends React.Component {

  static propTypes = {
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
  };

  render() {
    return (<div id="app">
      <Header />
      <Data {...this.props}>
        <Map />
        <Sidebar {...this.props} />
      </Data>
    </div>);
  }
}

export default App;