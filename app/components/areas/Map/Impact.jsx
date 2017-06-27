import React from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import CircleSVG from "components/svg/Circle";

import "./style.scss";

const baseLayerURL = "https://careinternational.carto.com/api/v2/viz/aa0b663e-b8af-4433-9ab0-4dbeb7c1b981/viz.json";

const labelLayerURL = "https://careinternational.carto.com/api/v2/viz/3cb14d6b-49ab-423b-8290-7a19d374381e/viz.json";

const bucketSize = {
  1: 150,
  2: 120,
  3: 70,
};

const getSVGIcon = (value, program, size) => {
  let label = value.toLocaleString();
  let component = (<CircleSVG program={program} label={label} size={size} />);
  let html = ReactDOMServer.renderToString(component);

  return window.L.divIcon({
    html: html,
    iconSize: size,
    iconAnchor: [size / 2, size / 2],
  });
};

class ImpactMapArea extends React.Component {

  static propTypes = {
    country: PropTypes.string,
    region: PropTypes.string,
    regions: PropTypes.array,
    bounds: PropTypes.array,
    program: PropTypes.string,
    handleCountryChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
    regions: [],
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

  initMarkers() {
    this.markers = this.props.regions.map((region) => {

      let value = this.props.program === "overall" ?
        region["total_impact"] :
        region[`${this.props.program}_impact`];

      if (!value) {
        return null;
      }

      let bucket = this.props.buckets.find((bucket) => bucket.region === region.region);
      return window.L.marker([region.region_center_y, region.region_center_x], {
        icon: getSVGIcon(value, this.props.program, bucketSize[bucket.position]),
      }).addTo(this.map);

    }).filter((s) => s);
  }

  destroyMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
    this.markers = [];
  }

  componentDidMount() {
    this.initLeaflet();
    this.initMarkers();
  }

  componentWillUnmount() {
    this.destroyMarkers();
    this.destroyLeaflet();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regions !== this.props.regions) {
      this.destroyMarkers();
      this.initMarkers();
    }
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
