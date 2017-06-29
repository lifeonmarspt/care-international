import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import humanize from "lib/humanize";
import range from "lib/range";

import { getReachMapSQL } from "lib/queries";

import config from "config.json";

import "./style.scss";

import cartocss from "!raw-loader!cartocss-loader!sass-loader?outputStyle=compressed!./style.carto.scss";


class ReachMapArea extends React.Component {

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
        this.props.handleCountryChange(data.country);
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
    return (<div id="legend">
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
            {this.props.buckets.map((bucket, n) => {
              return (<li key={n} className={`program-${this.props.program} bucket-${n + 1}`}>
                <span>{humanize(bucket.max)}</span>
              </li>);
            })}
          </ul>
          <ul className="exceptions">
            <li className="no-data">
              <span>No data</span>
            </li>
            <li className="care-member">
              <span>Care international members</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>);
  }

}

export default ReachMapArea;
