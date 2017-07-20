import React from "react";
import PropTypes from "prop-types";

import config from "config.json";

import "./style.scss";

const maxBounds = [[-90, -180], [90, 180]];

class LeafletProvider extends React.Component {

  static childContextTypes = {
    map: PropTypes.object,
  }

  static propTypes = {
    bounds: PropTypes.array,
    initialZoom: PropTypes.number,
    handlers: PropTypes.shape({
      handleShare: PropTypes.func.isRequired,
      handleOpenLegend: PropTypes.func.isRequired,
    }),
  }

  static defaultProps = {
    initialZoom: 2,
  };

  getChildContext() {
    return {
      map: this.map,
    };
  }

  constructor(...args) {
    super(...args);

    this.state = {};
  }

  initLeaflet() {
    this.map = window.L.map("leaflet", {
      center: [0, 0],
      zoom: this.props.initialZoom,
      minZoom: 2,
      maxZoom: 7,
      zoomControl: false,
    });

    window.cartodb.createLayer(this.map, config.cartodb.layer.base, {
      https: true,
    }).addTo(this.map).done((layer) => {
      layer.setZIndex(0);
    });

    window.cartodb.createLayer(this.map, config.cartodb.layer.label, {
      https: true,
    }).addTo(this.map).done((layer) => {
      layer.setZIndex(2);

      this.setState({ loaded: true });
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
    this.props.handlers.handleShare();
  }

  componentDidMount() {
    this.initLeaflet();

    if (this.props.bounds) {
      this.map.fitBounds(this.props.bounds, { animate: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.bounds && this.props.bounds !== prevProps.bounds) {
      this.map.fitBounds(this.props.bounds, { animate: false });
    } else if (!this.props.bounds && prevProps.bounds) {
      this.map.fitBounds(maxBounds, { animate: false });
    }
  }

  componentWillUnmount() {
    this.destroyLeaflet();
  }

  render() {
    let {
      handleShare,
      handleOpenLegend,
    } = this.props.handlers;

    return (<div id="map">
      <div id="leaflet" />
      <div id="leaflet-custom-controls">
        <div id="leaflet-zoom-plus" onClick={() => this.zoomIn()} />
        <div id="leaflet-zoom-minus" onClick={() => this.zoomOut()} />
        <div id="leaflet-share" onClick={handleShare} />
        <div id="mobile-legend" onClick={handleOpenLegend} />
      </div>
      {this.state.loaded ? this.props.children : null}
    </div>);
  }
};

export default LeafletProvider;
