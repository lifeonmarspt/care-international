import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import AppLink from "components/elements/AppLink";
import RadioButton from "components/elements/Radio";
import BarWrapper from "components/wrappers/Bar";
import ValueBar from "components/elements/ValueBar";
import RhombusSVG from "components/svg/Rhombus";

import uniq from "lib/uniq";
import getLocation from "lib/location";
import programs from "resources/programs.json";

import "./style.scss";

class ImpactSidebarArea extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    statistics: PropTypes.object.isRequired,
    reach: PropTypes.bool,
    impact: PropTypes.bool,
    region: PropTypes.string,
    country: PropTypes.string,
    program: PropTypes.string,
    stories: PropTypes.array,
    handleProgramChange: PropTypes.func,
  }

  static defaultProps = {
    program: "overall",
  };

  render() {
    let {
      loading,
      region,
      country,
      program,
      statistics,
      handleProgramChange,
    } = this.props;

    if (loading) {
      return (<div id="sidebar" />);
    }

    return (<div id="sidebar">

      {(region || country) && (<div className="breadcrumbs">
        <ul>
          <li>
            <AppLink mainView="impact" program={program}>
              World
            </AppLink>
          </li>
          {region && country && (<li>
            <AppLink mainView="impact" program={program} region={region}>
              {region}
            </AppLink>
          </li>)}
          {region && !country && (<li>{region}</li>)}
          {country && (<li>{country}</li>)}
        </ul>
      </div>)}

      {program === "overall" && (<div className="content">
        <dl>
          <dt>
            Total Population impacted in 2016
          </dt>
          <dd>
            <span>{(statistics.total_impact || 0).toLocaleString()}</span>
          </dd>
        </dl>
      </div>)}

      {program !== "overall" && (<div className="content">
        <dl>
          <dt>
            Total Population impacted in 2016
            <span className="subtitle">{programs.find((p) => p.id === program).label}</span>
          </dt>
          <dd>
            <span>{(statistics[`${program}_impact`] || 0).toLocaleString()}</span>
          </dd>
        </dl>
      </div>)}

      <div className="filters">
        <dl>
          <dt>
            Participants by program area
          </dt>
          <dd>
            <ul>
              {programs.map((p, n) => {

                let value = statistics[`${p.id}_impact`];
                let maxValue = statistics["total_impact"];

                return (<li key={n} className={p.id}>
                  <RadioButton
                    id={`radio-${n}`}
                    name="program-filter"
                    checked={program === p.id}
                    onChange={() => handleProgramChange(p.id)}>
                    {p.label}
                  </RadioButton>
                  <BarWrapper bar={ValueBar}
                    value={value}
                    maxValue={maxValue}
                    formatter={(v) => v.toLocaleString()}
                    colorClass={p.id} />
                </li>);

              })}
            </ul>
          </dd>
        </dl>
      </div>

      <div className="stories">
        <dl>
          <dt>
            All impacts
            <hr />
          </dt>
          <dd>
            <ul>
              {uniq(this.props.stories, (s) => s.story_number).map((story) => {

                let location = getLocation({
                  mainView: "impact",
                  country: story.country,
                  story: story.cartodb_id,
                });

                return (<li key={story.cartodb_id}>
                  <ul className="story">
                    <li className="title">
                      <Link to={location}>{story.story}</Link>
                    </li>
                    <li className="outcome">
                      <RhombusSVG size={15} program={story.outcome} />
                      {story.outcome}
                    </li>
                    <li className="location">
                      {story.country}
                    </li>
                  </ul>
                </li>);
              })}
            </ul>
          </dd>
        </dl>
      </div>

      {program !== "overall" && (<div className="clear-filters">
        <ul>
          <li className="see-overall">
            <AppLink mainView="impact" region={region} country={country}>
              See all program areas
            </AppLink>
          </li>
        </ul>
      </div>)}

    </div>);
  }

}


export default ImpactSidebarArea;
