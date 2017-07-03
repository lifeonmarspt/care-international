import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

// @TODO: don't hardcode urls
const baseLayerURL = "https://careinternational.carto.com/api/v2/viz/aa0b663e-b8af-4433-9ab0-4dbeb7c1b981/viz.json";
const labelLayerURL = "https://careinternational.carto.com/api/v2/viz/3cb14d6b-49ab-423b-8290-7a19d374381e/viz.json";

class LeafletProvider extends React.Component {

  static childContextTypes = {
    map: PropTypes.object,
  }

  static propTypes = {
    bounds: PropTypes.array,
    handleShare: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      map: this.map,
    };
  }

  initLeaflet() {
    this.map = window.L.map("leaflet", {
      zoomControl: false,
    }).setView([0, 0], 3);

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
  };

  destroyLeaflet() {
    this.map.remove();
  };

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }

  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
  }

  share() {
    this.props.handleShare();
  }

  componentDidMount() {
    this.initLeaflet();

    if (this.props.bounds) {
      this.map.fitBounds(this.props.bounds);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.bounds && this.props.bounds !== prevProps.bounds) {
      this.map.fitBounds(this.props.bounds);
    }
  }

  componentWillUnmount() {
    this.destroyLeaflet();
  }

  render() {
    return (<div id="map">
      <div id="leaflet-custom-controls">
        <div id="leaflet-zoom-plus" onClick={this.zoomIn.bind(this)} />
        <div id="leaflet-zoom-minus" onClick={this.zoomOut.bind(this)} />
        <div id="leaflet-share" onClick={this.share.bind(this) } />
      </div>
      <div id="leaflet" />
      {this.map ? this.props.children : null}
    </div>);
  }

};

export default LeafletProvider;
