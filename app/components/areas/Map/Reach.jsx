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

    // set a base layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors",
    }).addTo(this.map);
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
    }).addTo(this.map).on("done", (layer) => {

      this.layer = layer;

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

    }).on("error", (err) => {
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

  render() {
    return (
      <div id="map">
        <div id="leaflet" />
        <div id="legend">
          <Link to="#">Show Regions</Link>
          <p>Participants reached by country</p>
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
        </div>
      </div>
    );
  }

}

export default ReachMapArea;
