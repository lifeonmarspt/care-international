import React from "react";
import PropTypes from "prop-types";

import ReachLegend from "components/content/ReachLegend";

import { getReachMapCountriesSQL, getReachMapRegionsSQL } from "lib/queries";

import config from "config.json";

import cartocss from "!raw-loader!cartocss-loader!sass-loader?outputStyle=compressed!./style.carto.scss";

class ReachMapArea extends React.Component {

  static propTypes = {
    subView: PropTypes.oneOf([
      "countries",
      "regions",
    ]),
    country: PropTypes.string,
    bounds: PropTypes.array,
    program: PropTypes.string,
    handleMapChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    program: "overall",
  }

  static contextTypes = {
    map: PropTypes.object.isRequired,
  };

  getCartoCSS() {
    return cartocss;
  }

  initCartoDBLayer() {
    let sql = this.props.subView === "countries" ?
      getReachMapCountriesSQL(this.props.program) :
      getReachMapRegionsSQL(this.props.program);

    let interactivity = this.props.subView === "countries" ?
      "bucket, country, region, data" :
      "bucket, region, data";

    // add the cartodb layer
    let layerSource = {
      user_name: config.cartodb.account,
      map_api_template: "https://{user}.carto.com",
      type: "cartodb",
      sublayers: [
        {
          sql: sql,
          cartocss: this.getCartoCSS(),
          interactivity: interactivity,
        },
      ],
    };

    window.cartodb.createLayer(this.context.map, layerSource, {
      https: true,
    }).addTo(this.context.map).done((layer) => {

      this.layer = layer;

      layer.setZIndex(1);

      let subLayer = this.layer.getSubLayer(0);
      subLayer.setInteraction(true);

      subLayer.on("featureClick", (e, latlng, pos, data) => {
        if (data.data === null) {
          return;
        }

        if (this.props.subView === "countries") {
          this.props.handleMapChange(null, data.country);
        } else if (this.props.subView === "regions") {
          this.props.handleMapChange(data.region);
        }

      });

      subLayer.on("featureOver", (e, latlng, pos, data) => {
        if (data.data !== null) {
          document.getElementById("leaflet").classList.add("clickable");
        } else {
          document.getElementById("leaflet").classList.remove("clickable");
        }
      });

      subLayer.on("featureOut", () => {
        document.getElementById("leaflet").classList.remove("clickable");
      });

    }).error((err) => {
      // eslint-disable-next-line
      console.error("some error occurred: " + err);
    });

  }

  destroyCartoDBLayer() {
    this.layer.remove();
  }

  componentDidMount() {
    this.initCartoDBLayer();
  }

  componentWillUnmount() {
    this.destroyCartoDBLayer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.program !== this.props.program) {
      this.destroyCartoDBLayer();
      this.initCartoDBLayer();
    }
  }

  render() {
    return (<div className="map-area-content">
      <div id="legend" className="choropleth">
        <ReachLegend subView={this.props.subView} program={this.props.program} />
      </div>
    </div>);
  }

}

export default ReachMapArea;
