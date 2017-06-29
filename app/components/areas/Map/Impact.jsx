import React from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import CircleSVG from "components/svg/Circle";

import "./style.scss";

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
    handleRegionChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
    regions: [],
  }

  static contextTypes = {
    map: PropTypes.object.isRequired,
  }

  initMarkers() {
    this.markers = this.props.regions.map((region) => {

      let value = region[`${this.props.program}_impact`];

      if (!value) {
        return null;
      }

      return window.L.marker([region.region_center_y, region.region_center_x], {
        icon: getSVGIcon(value, this.props.program, bucketSize[region[`${this.props.program}_position`]]),
      }).addTo(this.context.map).on("click", () => {
        this.props.handleRegionChange(region.region);
      });

    }).filter((s) => s);
  }

  destroyMarkers() {
    this.markers.forEach((marker) => this.context.map.removeLayer(marker));
    this.markers = [];
  }

  componentDidMount() {
    this.initMarkers();
  }

  componentWillUnmount() {
    this.destroyMarkers();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.regions !== this.props.regions) {
      this.destroyMarkers();
      this.initMarkers();
    }
  }


  render() {
    return (
      <div id="legend">
        herp
      </div>
    );
  }

}

export default ImpactMapArea;
