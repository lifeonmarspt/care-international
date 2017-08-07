module.exports = function(contents) {
  return contents.replace(
    /\[([^=]*)="carto\(([^,]*),([^)]*)\)"\]/g,
    "[$1$2$3]"
  );
};
