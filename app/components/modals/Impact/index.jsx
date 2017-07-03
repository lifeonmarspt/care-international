import React from "react";
import PropTypes from "prop-types";

import ModalBox from "components/elements/ModalBox";

import "../style.scss";

class ImpactModal extends React.Component {

  static propTypes= {
    hidden: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    return (<ModalBox hidden={this.props.hidden} handleClose={this.props.handleClose}>
      <div id="about-reach" className="modal-content">
        <div className="scrollable">
          <h1>
            About Impact Data
          </h1>
          <hr />
          <dl className="main">
            <dt>Impact Data</dt>
            <dd>Impact definition lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</dd>
            <dt>Outcomes</dt>
            <dd>
              <dl className="sub">
                <dt>Food and Nutrition Security</dt>
                <dd>Despite progress in recent decades, about 795 million people – or around one in nine – still suffer from chronic undernourishment or hunger. Women and girls are particularly at risk. When food is scarce, women are the first to go short, or even go without. The fact is that there’s enough food in the world to feed everyone, but not everyone gets enough food to eat. That’s an injustice and it has to stop.</dd>
                <dt>Sexual, Reproductive and Maternal Health</dt>
                <dd>Poor health and poverty go hand-in-hand. Therefore, CARE fights poverty by improving the health of millions of the world’s poorest people- particularly women and girls. In poor countries around the world, women in particular struggle to live full and healthy lives. CARE is improving women’s health by providing access to health services, and understanding of reproductive health, HIV prevention, and maternal care.</dd>
                <dt>Sexual, Reproductive and Maternal Health</dt>
                <dd>Poor health and poverty go hand-in-hand. Therefore, CARE fights poverty by improving the health of millions of the world’s poorest people- particularly women and girls. In poor countries around the world, women in particular struggle to live full and healthy lives. CARE is improving women’s health by providing access to health services, and understanding of reproductive health, HIV prevention, and maternal care.</dd>
                <dt>Sexual, Reproductive and Maternal Health</dt>
                <dd>Poor health and poverty go hand-in-hand. Therefore, CARE fights poverty by improving the health of millions of the world’s poorest people- particularly women and girls. In poor countries around the world, women in particular struggle to live full and healthy lives. CARE is improving women’s health by providing access to health services, and understanding of reproductive health, HIV prevention, and maternal care.</dd>
              </dl>
            </dd>
          </dl>
        </div>
      </div>
    </ModalBox>);
  }
}

export default ImpactModal;
