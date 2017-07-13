import React from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import StorySummary from "components/elements/StorySummary";
import CircleSVG from "components/svg/Circle";
import RhombusSVG from "components/svg/Rhombus";
import buckets from "resources/buckets.json";

const getSVGIcon = (SVGComponent, props) => {
  let { value, program, size, hideLabel } = props;
  let label = value && value.toLocaleString();
  let component = (<SVGComponent shadow program={program} label={label} hideLabel={hideLabel} size={size} />);
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
    handleMapChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
    regions: [],
    stories: [],
  }

  static contextTypes = {
    map: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  getPopup(story) {
    let component = (<StorySummary story={story} router={this.context.router} />);

    let html = ReactDOMServer.renderToString(component);

    return window.L.popup({
      minWidth: 290,
      minHeight: 100,
      className: "custom-popup",
    }).setContent(html);
  }


  initMarkers() {
    this.quantitativeMarkers = this.props.regions.map((region) => {

      let value = region[`${this.props.program}_impact`];

      if (!value) {
        return null;
      }

      let iconSize = region[`${this.props.program}_size`];

      return window.L.marker([region.region_center_y, region.region_center_x], {
        icon: getSVGIcon(CircleSVG, {
          value: value,
          program: this.props.program,
          size: iconSize,
        }),
        zIndexOffset: 100,
      }).addTo(this.context.map).on("click", () => {
        this.props.handleMapChange(region.region, region.country);
      });

    }).filter((s) => s);

    this.qualitativeMarkers = this.props.stories.map((story) => {

      if (this.props.program !== "overall" && story.outcome !== this.props.program) {
        return null;
      }

      return window.L.marker([story.lat, story.lon], {
        icon: getSVGIcon(RhombusSVG, {
          program: story.outcome,
          size: 18,
        }),
        zIndexOffset: 200,
      }).bindPopup(this.getPopup(story)).addTo(this.context.map);

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
    return (<div className="map-area-content">
      <div id="legend" className="impact">
        <ul>
          <li>Type of impacts</li>
          <li>
            <ul>
              <li>
                <RhombusSVG size={15} /> Qualitative
              </li>
              <li>
                <CircleSVG size={15} /> Quantitative
              </li>
            </ul>
          </li>
          <li>Population impacted (quantitative)</li>
          <li>
            <ul>
              <li>
                1
              </li>
              {buckets.impact.map((bucket, n) => (<li key={n}>
                <CircleSVG size={bucket[2]/2} />
              </li>))}
              <li>
                12M population impacted
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>);
  }

}

export default ImpactMapArea;
