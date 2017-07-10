import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { getReachMapSQL } from "lib/queries";

import imgHelp from "images/help.svg";
import buckets from "resources/buckets.json";
import config from "config.json";

import "./style.scss";

import cartocss from "!raw-loader!cartocss-loader!sass-loader?outputStyle=compressed!./style.carto.scss";

class ReachMapArea extends React.Component {

  static propTypes = {
    country: PropTypes.string,
    bounds: PropTypes.array,
    program: PropTypes.string,
    handleMapChange: PropTypes.func.isRequired,
    handleAboutClick: PropTypes.func.isRequired,
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
    // add the cartodb layer
    let layerSource = {
      user_name: config.cartodb.account,
      map_api_template: "https://{user}.carto.com",
      type: "cartodb",
      sublayers: [
        {
          sql: getReachMapSQL(this.props.program),
          cartocss: this.getCartoCSS(),
          interactivity: "bucket, country, region",
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
        if (data.bucket === null) return;
        this.props.handleMapChange(null, data.country);
      });

      subLayer.on("featureOver", (e, latlng, pos, data) => {
        if (data.bucket === null) {
          document.getElementById("leaflet").classList.remove("clickable");
        } else {
          document.getElementById("leaflet").classList.add("clickable");
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
    return (<div id="map-area">
      <div id="legend" className="choropleth">
        <ul>
          <li>
            <Link to="#">Show Regions</Link>
          </li>
          <li>
            <p>
              Direct participants reached in 2016 by country
            </p>
          </li>
          <li>
            <ul className="scale">
              {buckets.map((bucket, n) => {
                return (<li key={n} className={`program-${this.props.program} bucket-${n + 1}`}>
                  <span>{bucket[2]}</span>
                </li>);
              })}
            </ul>
            <ul className="exceptions">
              <li className="no-data">
                <span>No participants recorded or other type of activities</span>
              </li>
              <li className="care-member">
                <span>CARE International Members or Affiliate Members</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="about-data">
        <div className="clickable" onClick={this.props.handleAboutClick}>
          <span>
            About reach data
          </span>
          <img src={imgHelp} alt="Help" />
        </div>
      </div>
    </div>);
  }

}

export default ReachMapArea;
