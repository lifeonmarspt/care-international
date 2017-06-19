import React from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

class MapArea extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (<div id="map">
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    </div>);
  }

}

export default MapArea;
