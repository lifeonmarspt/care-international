import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import humanize from "lib/humanize";
import range from "lib/range";
import { numBuckets, getReachMapSQL } from "lib/queries";
import { fetchBounds } from "lib/remote";

import config from "config.json";
import meta from "resources/meta.json";

import "./style.scss";

const mainColor = (colorClass = "neutral", opacity = 0.8) =>
  `rgba(${meta.colors[colorClass].map((c) => c.toString(10))}, ${opacity})`;


const baseLayerURL = "https://careinternational.carto.com/api/v2/viz/aa0b663e-b8af-4433-9ab0-4dbeb7c1b981/viz.json";

const labelLayerURL = "https://careinternational.carto.com/api/v2/viz/3cb14d6b-49ab-423b-8290-7a19d374381e/viz.json";

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

  getCartoCSS() {
    return range(1, numBuckets)
      .map((n) => `
        #layer[bucket=${n}] {
          polygon-fill: ${mainColor(this.props.program)};
          polygon-opacity: ${n/numBuckets};
          line-color: ${mainColor(this.props.program)};
        }
      `)
      .join(" ") + `
      #layer[bucket=null] {
        polygon-fill: #888;
        polygon-opacity: 0.6;
        line-color: #888;
      }
      #layed[care_member=true] {
        polygon-pattern-file: url(http://com.cartodb.users-assets.production.s3.amazonaws.com/patterns/diagonal_1px_med.png);
      }
      `;
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

    window.cartodb.createLayer(this.map, layerSource, {
      https: true,
    }).addTo(this.map).done((layer) => {

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

  destroyLeaflet() {
    this.map.remove();
  }

  destroyCartoDBLayer() {
    this.layer.remove();
  }

  componentDidMount() {
    this.initLeaflet();
    this.initCartoDBLayer();
  }

  componentWillUnmount() {
    this.destroyCartoDBLayer();
    this.destroyLeaflet();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.program !== this.props.program) {
      this.destroyCartoDBLayer();
      this.initCartoDBLayer();
    }

    if (prevProps.country !== this.props.country) {
      fetchBounds("reach_data", this.props.country)
        .then((bounds) => {
          this.map.fitBounds(bounds);
        });
    }
  }

  renderLegend() {
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
              let liStyle = {
                backgroundColor: mainColor(this.props.program, (n+1) / this.props.buckets.length),
              };
              return (<li key={n} style={liStyle}>
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

  render() {
    return (<div id="map">
      <div id="leaflet" />
      {this.renderLegend()}
    </div>);
  }

}

export default ReachMapArea;
