import React from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import CircleSVG from "components/svg/Circle";
import RhombusSVG from "components/svg/Rhombus";
import imgHelp from "images/help.svg";

import "./style.scss";

const bucketSize = {
  regions: {
    1: 150,
    2: 120,
    3: 70,
  },
  countries: {
    1: 70,
    2: 50,
    3: 30,
  },
};

const getSVGIcon = (SVGComponent, value, program, size) => {
  let label = value && value.toLocaleString();
  let component = (<SVGComponent program={program} label={label} size={size} />);
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
    stories: PropTypes.array,
    program: PropTypes.string,
    handleRegionChange: PropTypes.func,
    handleStoryChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
    regions: [],
    stories: [],
  }

  static contextTypes = {
    map: PropTypes.object.isRequired,
  }

  initMarkers() {
    this.quantitativeMarkers = this.props.regions.map((region) => {

      let value = region[`${this.props.program}_impact`];

      if (!value) {
        return null;
      }

      let iconSize = bucketSize
        [this.props.region ? "countries" : "regions"]
        [region[`${this.props.program}_position`]];

      return window.L.marker([region.region_center_y, region.region_center_x], {
        icon: getSVGIcon(CircleSVG, value, this.props.program, iconSize),
      }).addTo(this.context.map).on("click", () => {
        this.props.handleRegionChange(region.region);
      });

    }).filter((s) => s);

    this.qualitativeMarkers = this.props.stories.map((story) => {

      return window.L.marker([story.lat, story.lon], {
        icon: getSVGIcon(RhombusSVG, null, this.props.program, 20),
      }).addTo(this.context.map).on("click", () => {
        this.props.handleStoryChange(story);
      });

    }).filter((s) => s);
  }

  destroyMarkers() {
    this.quantitativeMarkers.forEach((marker) => this.context.map.removeLayer(marker));
    this.quantitativeMarkers = [];

    this.qualitativeMarkers.forEach((marker) => this.context.map.removeLayer(marker));
    this.quantitativeMarkers = [];
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
        <div id="about" onClick={this.props.handleAboutClick}>
          About impact data
          <img src={imgHelp} alt="Help" />
        </div>
      </div>
    );
  }

}

export default ImpactMapArea;
