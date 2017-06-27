import queryString from "query-string";

const getLocation = (reach, impact, region, country, program) => {

  let qs = queryString.stringify({
    program: program,
  });

  let parts = [];

  if (reach) {
    parts.push("reach");
  }

  if (impact) {
    parts.push("impact");
  }

  if (region) {
    parts.push(encodeURIComponent(region));
  }

  if (country) {
    parts.push(encodeURIComponent(country));
  }

  return "/" + parts.join("/") + (qs ? `?${qs}` : "");

};

export default getLocation;
