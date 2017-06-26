import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

class ImpactMapArea extends React.Component {

  static propTypes = {
    country: PropTypes.string,
    buckets: PropTypes.array.isRequired,
    bounds: PropTypes.array,
    program: PropTypes.string,
    handleCountryChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
  }

  initLeaflet() {
    this.map = window.L.map("leaflet").setView([0, 0], 3);

    // set a base layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors",
    }).addTo(this.map);
  }

  destroyLeaflet() {
    this.map.remove();
  }

  componentDidMount() {
    this.initLeaflet();
  }

  componentWillUnmount() {
    this.destroyLeaflet();
  }

  render() {
    return (
      <div id="map">
        <div id="leaflet" />
      </div>
    );
  }

}

export default ImpactMapArea;
