/* eslint no-console: 0 */
const ghpages = require('gh-pages');
const colors = require('colors');

ghpages.publish('dist', (err) => {
  if (err) {
    console.log(colors.red(err));
  } else {
    console.log(colors.green('Success! Application has been published correctly.'));
  }
});
