import React from "react";
import config from "config.json";

class MapArea extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
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
          sql: "select * from impact_data",
          cartocss: "#layer { polygon-fill: #F00; polygon-opacity: 0.3; line-color: #F00; }",
        },
      ],
    };

    window.cartodb.createLayer(this.map, layerSource, {
      https: true,
    }).addTo(this.map);

  }


  render() {
    return (<div id="map" />);
  }

}

export default MapArea;
