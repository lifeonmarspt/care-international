import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Squel from "squel";

import humanize from "lib/humanize";
import range from "lib/range";
import config from "config.json";

import "./style.sass";

const numBuckets = 5;
const mainColor = (opacity = 1) => `rgba(18, 158, 173, ${opacity})`;


class MapArea extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
      buckets: [],
    };

    // eslint-disable-next-line
    this.cartoSQL = window.cartodb.SQL({
      user: config.cartodb.account,
      sql_api_template: "https://{user}.cartodb.com",
    });
  }

  static contextTypes = {
    buckets: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
  }

  getSQL() {
    let fields = [
      "*",
      `NTILE(${numBuckets}) OVER(ORDER BY total_num_direct_participants + total_num_indirect_participants) AS bucket`,
    ];
    let query = Squel.select().fields(fields).from("reach_data");

    return query.toString();
  }

  getCartoCSS() {
    return range(1, numBuckets)
      .map((n) => `
        #layer[bucket=${n}] {
          polygon-fill: ${mainColor()};
          polygon-opacity: ${n/numBuckets};
          line-color: ${mainColor()};
        }
      `)
      .join(" ");
  }

  componentDidMount() {
    this.map = window.L.map("leaflet").setView([0, 0], 3);

    // set a base layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors",
    }).addTo(this.map);

    // add the cartodb layer
    let layerSource = {
      user_name: config.cartodb.account,
      type: "cartodb",
      sublayers: [
        {
          sql: this.getSQL(),
          cartocss: this.getCartoCSS(),
          interactivity: "country, region",
        },
      ],
    };

    window.cartodb.createLayer(this.map, layerSource, {
      https: true,
    }).addTo(this.map).on("done", (layer) => {

      let subLayer = layer.getSubLayer(0);
      subLayer.setInteraction(true);

      subLayer.on("featureClick", (e, latlng, pos, data) => {
        let url = "/reach/" + encodeURIComponent(data.country);
        this.context.router.history.push(url);
      });

      subLayer.on("featureOver", () => {
        document.getElementById("map").classList.add("clickable");
      });

      subLayer.on("featureOut", () => {
        document.getElementById("map").classList.remove("clickable");
      });

    }).on("error", (err) => {
      console.error("some error occurred: " + err);
    });


  }

  render() {
    return (
      <div id="map">
        <div id="leaflet" />
        <div id="legend">
          <Link to="#">Show Regions</Link>
          <p>Participants reached by country</p>
          <ul>
            {this.context.buckets.map((bucket, n) => {
              let liStyle = {
                backgroundColor: mainColor((n+1) / this.context.buckets.length),
              };
              return (<li key={n} style={liStyle}>
                <span>{humanize(bucket.max)}</span>
              </li>);
            })}
          </ul>
        </div>
      </div>
    );
  }

}

export default MapArea;
