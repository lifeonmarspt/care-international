import PropTypes from "prop-types";

const navigation = PropTypes.shape({
  mainView: PropTypes.oneOf([
    "notfound",
    "reach",
    "impact",
  ]).isRequired,
  subView: PropTypes.oneOf([
    "countries",
    "regions",
  ]),
  region: PropTypes.string,
  country: PropTypes.string,
  story: PropTypes.string,
  program: PropTypes.string,
});

export default navigation;
