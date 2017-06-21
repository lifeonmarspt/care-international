import React from "react";
import { NavLink } from "react-router-dom";

import imgCare from "images/care.png";
import "./style.sass";

class HeaderArea extends React.Component {

  render() {
    return (<div id="header">
    
      <div className="menu">
        <ul className="menu">
          <li>
            <NavLink to="/reach" activeClassName="active">reach</NavLink>
          </li>
          <li>
            <NavLink to="/impact" activeClassName="active">impact</NavLink>
          </li>
        </ul>
      </div>

      <div className="logo">
        <img alt="care" src={imgCare} />
      </div>

    </div>);
  }

}

export default HeaderArea;
