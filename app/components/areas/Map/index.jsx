import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Squel from "squel";

import humanize from "lib/humanize";
import range from "lib/range";

import config from "config.json";
import meta from "resources/meta.json";

import "./style.sass";

const numBuckets = 5;
const mainColor = (colorClass = "neutral", opacity = 0.8) =>
  `rgba(${meta.colors[colorClass].map((c) => c.toString(10))}, ${opacity})`;


class MapArea extends React.Component {

  static propTypes = {
    outcome: PropTypes.string,
  }

  static defaultProps = {
    outcome: "overall",
  }

  static contextTypes = {
    buckets: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
  }

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
          polygon-fill: ${mainColor(this.props.outcome)};
          polygon-opacity: ${n/numBuckets};
          line-color: ${mainColor(this.props.outcome)};
        }
      `)
      .join(" ");
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

      this.layer = layer;

      let subLayer = this.layer.getSubLayer(0);
      subLayer.setInteraction(true);

      subLayer.on("featureClick", (e, latlng, pos, data) => {
        let url = "/reach/" + encodeURIComponent(data.country);
        this.context.router.history.push(url);
      });

      subLayer.on("featureOver", () => {
        document.getElementById("leaflet").classList.add("clickable");
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

  componentDidUpdate(prevProps) {
    if (prevProps.outcome !== this.props.outcome) {
      this.destroyCartoDBLayer();
      this.initCartoDBLayer();
    }
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
                backgroundColor: mainColor(this.props.outcome, (n+1) / this.context.buckets.length),
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
