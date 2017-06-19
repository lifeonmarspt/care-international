To deploy a javascript SPA thing, add two webpacks: nodejs and
heroku-buildpack-static (the order might be relevant):

    heroku buildpacks:clear
    heroku buildpacks:add heroku/nodejs
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static


Add a `postinstall` script to package.json:

    "postinstall": "yarn run build"


Add a `static.json` file, used to trigger the static-buildpack and feed the
nginx configuration. Check the repo for details on its syntax. Sample file:

    {
      "root": "dist/",
      "routes": {
        "/*": "index.html"
      }
    }


If you're using yarn, you might be required to disable heroku's node modules
cache, to avoid node-sass vendor issues:

    heroku config:set NODE_MODULES_CACHE=false


Heroku runs npm/yarn in production mode, so it won't install `devDependencies`.
Make sure all your build dependencies requirements are in the `dependencies`
section.

    heroku config:set NPM_CONFIG_PRODUCTION=false
