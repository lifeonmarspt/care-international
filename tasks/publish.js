const ghpages = require('gh-pages');
const path = require('path');
const colors = require('colors');

ghpages.publish('dist', function (err) {
  if (err) {
    console.log(err);
  }
  console.log(colors.green('Success! Application has been published correctly.'));
});
