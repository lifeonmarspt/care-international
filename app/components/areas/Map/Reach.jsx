import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import humanize from "lib/humanize";
import range from "lib/range";

import { numBuckets, getReachMapSQL } from "lib/queries";

import config from "config.json";

import "./style.scss";

const choroColors = {
  overall: ["#FFD8BD", "#FEBB8B", "#FF984E", "#F9781C", "#A03B0D"],
  hum: ["#F8D0E1", "#F1A1C3", "#E972A5", "#E24387", "#DB1469"],
  wee: ["#D2EFF2", "#93EAF3", "#57D0DD", "#129EAE", "#005760"],
  srmh: ["#D2EFF2", "#93EAF3", "#57D0DD", "#129EAE", "#005760"],
  lffv: ["#D2EFF2", "#93EAF3", "#57D0DD", "#129EAE", "#005760"],
  fnscc: ["#D2EFF2", "#93EAF3", "#57D0DD", "#129EAE", "#005760"],
};

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
    return range(1, numBuckets)
      .map((n) => `
        #layer[bucket=${n}] {
          polygon-fill: ${choroColors[this.props.program][n-1]};
          line-color: #CCC;
        }
      `)
      .join(" ") + `
    #layer[bucket=null] {
        polygon-fill: #888;
        polygon-opacity: 0.6;
        line-color: #888;
      }
      #layed[care_member=true] {
        polygon-pattern-file: url(https://careinternational.herokuapp.com/stripes-pattern.png);
      }
      `;
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
              let liStyle = {
                backgroundColor: choroColors[this.props.program][n],
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

}

export default ReachMapArea;
