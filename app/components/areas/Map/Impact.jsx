import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const baseLayerURL = "https://careinternational.carto.com/api/v2/viz/aa0b663e-b8af-4433-9ab0-4dbeb7c1b981/viz.json";

const labelLayerURL = "https://careinternational.carto.com/api/v2/viz/3cb14d6b-49ab-423b-8290-7a19d374381e/viz.json";

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

    window.cartodb.createLayer(this.map, baseLayerURL, {
      https: true,
    }).addTo(this.map).done((layer) => {
      layer.setZIndex(0);
    });

    window.cartodb.createLayer(this.map, labelLayerURL, {
      https: true,
    }).addTo(this.map).done((layer) => {
      layer.setZIndex(2);
    });

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
