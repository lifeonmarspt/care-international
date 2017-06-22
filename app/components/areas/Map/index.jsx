import React from "react";
import PropTypes from "prop-types";
import Squel from "squel";

import range from "lib/range";
import config from "config.json";

import "./style.sass";

const buckets = 7;

class MapArea extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  getSQL() {
    let fields = [
      "*",
      `NTILE(${buckets}) OVER(ORDER BY total_num_direct_participants + total_num_indirect_participants) AS bucket`,
    ];
    let query = Squel.select().fields(fields).from("reach_data");

    return query.toString();
  }

  getCartoCSS() {
    const main = "#129EAD";
    return range(1, buckets)
      .map((n) => `
        #layer[bucket=${n}] {
          polygon-fill: ${main};
          polygon-opacity: ${n/buckets};
          line-color: ${main};
        }
      `)
      .join(" ");
  }

  componentDidMount() {
    this.map = window.L.map("map").setView([0, 0], 3);

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
    return (<div id="map" />);
  }

}

export default MapArea;
