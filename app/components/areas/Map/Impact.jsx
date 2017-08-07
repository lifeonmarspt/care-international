import React from "react";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

import ImpactLegend from "components/content/ImpactLegend";
import StorySummary from "components/elements/StorySummary";
import CircleSVG from "components/svg/Circle";
import RhombusSVG from "components/svg/Rhombus";

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
    program: PropTypes.string,
    regions: PropTypes.array,
    stories: PropTypes.array,
    handleMapChange: PropTypes.func.isRequired,
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

  constructor(...args) {
    super(...args);
    this.state = {
      tooltip: null,
    };
  }

  getPopup(story) {
    let component = (<StorySummary story={story} router={this.context.router} />);

    let html = ReactDOMServer.renderToString(component);

    return window.L.popup({
      minWidth: 290,
      minHeight: 100,
      className: "custom-tooltip",
    }).setContent(html);
  }


  initMarkers() {
    let {
      program,
      story,
      regions,
      stories,
      handleMapChange,
    } = this.props;

    this.quantitativeMarkers = regions.map((region) => {

      let value = region[`${program}_impact`];

      if (!value || story) {
        return null;
      }

      let iconSize = region[`${program}_size`];

      let marker =  window.L.marker([region.region_center_y, region.region_center_x], {
        icon: getSVGIcon(CircleSVG, {
          value: value,
          program: program,
          size: iconSize,
          label: region.region || region.country,
        }),
        zIndexOffset: 100,
      }).addTo(this.context.map).on("click", () => {
        handleMapChange(region.region, region.country);
      });

      marker.on("mouseover", (e) => {
        let target = e.originalEvent.target;
        if (target.tagName === "circle") {
          let {
            left,
            top,
            width,
          } = target.parentNode.parentNode.getBoundingClientRect();

          this.setState({
            tooltip: {
              left: left + width / 2,
              top: top,
              label: region.region || region.country,
            },
          });
        }
      });

      marker.on("mouseout", (e) => {
        let target = e.originalEvent.target;
        if (target.tagName === "circle") {
          this.setState({
            tooltip: null,
          });
        }
      });

      return marker;

    }).filter((s) => s);

    this.qualitativeMarkers = stories.map((story) => {

      if (program !== "overall" && story.outcome !== program) {
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

  componentWillReceiveProps() {
    this.setState({
      tooltip: null,
    });
  }


  render() {
    return (<div className="map-area-content">
      <div id="legend" className="impact">
        <ImpactLegend />
      </div>
      {this.state.tooltip && (<div className="custom-tooltip-wrapper" style={{
        left: this.state.tooltip.left,
        top: this.state.tooltip.top,
      }}>
        <div className="custom-tooltip">
          {this.state.tooltip.label}
          <div className="leaflet-popup-tip-container">
            <div className="leaflet-popup-tip" />
          </div>
        </div>
      </div>)}
    </div>);
  }

}

export default ImpactMapArea;
