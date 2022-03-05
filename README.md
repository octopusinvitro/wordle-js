[![Maintainability](https://api.codeclimate.com/v1/badges/563333ea3ffd9b1a5f5b/maintainability)](https://codeclimate.com/github/octopusinvitro/wordle-js/maintainability)
[![Depfu](https://badges.depfu.com/badges/0a4c5e533133dc8344ba5847bf0b437e/overview.svg)](https://depfu.com/github/octopusinvitro/wordle-js?project_id=34744)


# Wordle in JS

Implementation of a Wordle clone in JavaScript


## Project structure

The `app` folder is the working directory.

The `site` folder is recreated often, and should not be added to source control or used to store permanent files.


## Gupfile


The gulpfile has logic for the following:

* Compile the Sass files to CSS and CSS sourcemaps, as well as concatenate, autoprefix, and minify them.
* Concatenate and uglify the JS files and create sourcemaps.
* Remove old CSS, JS, image and HTML files in the `/site` folder and add the regenerated ones.
* Add a cache token to the path of JS and CSS files in the `index.html` file when their contents change.
* Watch for changes in CSS, JS, image and HTML files, then update the files in `site`, the cache token and reload the page if they change.
* Serve both the index and the tests endpoints.

It exports two tasks:

* `npm run assets`: it recreates the `site` folder files and cache token.
* `npm start`: default task, same as `assets` but also runs the server and watches the files.


## Local development

### One-off setup

1. Clone the repository and create a `site` folder. Then:

  ```sh
  cd site
  git clone git@github.com:octopusinvitro/wordle-js.git .
  git checkout --orphan gh-pages
  git reset
  rm -rf *.*
  git pull origin gh-pages
  cd ../
  ```

  Everytime you regenerate the site, it will update the files inside the site folder. To push them:

  ```sh
  cd site
  git add .
  git commit -m 'Update site'
  git push origin gh-pages
  cd ../
```

1. Download the [Jasmine standalone release](https://github.com/jasmine/jasmine/releases) and unzip it somewhere in your local machine. Then copy the `lib` folder inside the `app/js` folder.

  ```sh
  app/js/
  ├── lib/
  ├── spec/
  └── src/
  ```

### Running

```sh
npm install
npm start
```

this will run the default task and load the site at http://localhost:3000


### Testing

```sh
npm start
```
and load the tests page at http://localhost:3000/tests

or switch to another tab and type:

```sh
npm test
```

which will load the tests page for you.


## To do

* API for words
* pass the word to the game, maybe create a class to handle words.
* Save intermediate state, can close page and come back later.
* Show hint just once. Example: word: ADIEU, I had: AHEAD, it hinted the second A as present. Should only hint the first A as correct and the second A as absent.
* [Enable HTTPS in localhost](https://blogjunkie.net/2017/04/enable-https-localhost-browsersync/)
* Finish settings
* Make SVG icons accessible https://css-tricks.com/accessible-svg-icons/
* jump animation on win
* stretch when new letter typed
