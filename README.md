# Overview

This and two other repos were created to help demonstrate code sharing between different Node.js applications. The workers application uses the [Instagram](http://instagram.com/developer/endpoints/) and [Twitter](https://dev.twitter.com/docs/api/1.1) APIs to pull popular/recent posts and stuffs them into a database while the server simply displays the most recent posts that were fetched.

The overall application is broken up into a common lib, a server and a workers application.

* common - [source](https://github.com/twalling/trends-common)
* server - [source](https://github.com/twalling/trends-server)
* workers - [source](https://github.com/twalling/trends-workers)

Slides from a presentation covering the ideas behind this approach can be found at [Sharing Code Between Node.js Applications](http://life.neophi.com/danielr/2012/09/sharing_code_between_nodejs_ap.html).

## Demo

The server project is currently running at: [http://trends-server.herokuapp.com](http://trends-server.herokuapp.com)

## Common

This repo contains common code that's shared between the server and workers applications. Constants, config info, mongo connection logic and model objects are included.

## Server

The server consists of a simple express application which displays the most recent Instagram and Twitter posts that were fetched by the workers application.

## Workers

The workers consists of a two jobs which run at a set interval. One job pulls the the most popular Instagram photos based on location while the other job pulls the most recent/popular tweets based on a keyword and location. New results are entered into a MongoDB collection for the server.

## Things to Notice

The main thing to notice about these repos and their relationship is how the package.json for both server and workers references the common repo. This leverages npm and the ability to reference a public or private repo.

Snippet from package.json:

    {
      "dependencies": {
        "trend-common": "https://github.com/twalling/trends-common/tarball/master"
      }
    }

It's also worth noting the use of `npm link` below in the install instructions. This creates symlinks locally so that any development work on `trends-common` is picked up by the other projects. Otherwise one would have to push the latest changes to their github repo everytime they want to see these changes in their server or workers projects.

## Install

    git clone git@github.com:twalling/trends-common.git
    git clone git@github.com:twalling/trends-server.git
    git clone git@github.com:twalling/trends-workers.git
    
    cd trends-common
    npm install
    npm link
    
    cd ../trends-server
    npm link trends-common
    npm install
    
    cd ../trends-workers
    npm link trends-common
    npm install

## Setup

Currently the config will look for environment variables that it should override various properties with. The workers project needs API token info for both Twitter and Instagram before it can be run. Simply open up `trends-common/src/config.js` and fill out the appropriate fields. Normally I put these values in a config but since this is a public repo, I had to make the config a little more intelligent and rely more on environment variables. If you'd like a bootstrap bash script I use to set these environment variables before running workers, [go grab this gist](https://gist.github.com/3742877).

After setting up the config or the bootstrap script mentioned above, simply run the workers and the server project.

    cd trends-workers
    npm start
    
    cd trends-server
    npm start

If you're using the bootstrap script method:

    cd trends-workers
    ./bootstrap.sh

After the workers have run the jobs at least one time you should be able to browse to your local server project ([http://localhost:3000](http://localhost:3000)) and view the latest results from Instagram and Twitter.

## Deploying to Heroku

Coming soon...
