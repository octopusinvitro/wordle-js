const
  { dest, parallel, series, src, watch } = require('gulp'),
  browsersync  = require('browser-sync').create(),
  del          = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  concat       = require('gulp-concat'),
  eslint       = require('gulp-eslint'),
  replace      = require('gulp-replace'),
  sass         = require('gulp-sass')(require('sass')),
  terser       = require('gulp-terser'),

  dev = {
    img: './app/img/**/*',
    files: ['./app/index.html', './app/site.webmanifest'],
    js: './app/js/src/**/*.js',
    scss: './app/scss/**/*.scss',
    spec: './app/js/spec/**/*.js'
  },

  dist = {
    css: './site/css/',
    img: './site/img/',
    js: './site/js/',
    root: './site/'
  };

function css() {
  del.sync(`${dist.css}**`);
  return src(dev.scss, { sourcemaps: true })
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(dest(dist.css, { sourcemaps: '.' }));
}

function js() {
  del.sync(`${dist.js}**`);
  return src(dev.js, { sourcemaps: true })
    .pipe(concat('app.js'))
    .pipe(terser())
    .pipe(dest(dist.js, { sourcemaps: '.' }));
}

function img() {
  del.sync(`${dist.img}**`);
  return src(dev.img).pipe(dest(dist.img));
}

function html() {
  return src(dev.files).pipe(dest(dist.root));
}

function cache() {
  del.sync(`${dist.root}index.html`);
  return src(dev.files[0])
    .pipe(replace(/cachebust=\d+/g, 'cachebust=' + (new Date().getTime())))
    .pipe(dest(dist.root));
}

function lintJS() {
  return _lint(src(dev.js));
}

function lintSpec() {
  return _lint(src(dev.spec));
}

function _lint(files) {
  return files
    .pipe(eslint({ configFile: 'eslintrc.json' }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function watchFiles() {
  let makeDockerWork = { interval: 1000, usePolling: true };
  let assets = [dev.img, dev.js, dev.scss];
  watch(assets,             makeDockerWork, series(parallel(img, js, css, cache), reload));
  watch(dev.files,          makeDockerWork, series(html, reload));
  watch([dev.js, dev.spec], makeDockerWork, parallel(lintJS, lintSpec));
}

function server() {
  browsersync.init({
    server: { routes: { '/': dist.root, '/tests': './app/js/' } },
    notify: { styles: { top: 'auto', bottom: '0' } }
  });
}

function reload(callback) {
  browsersync.reload();
  callback();
}

const assets = parallel(css, html, img, js, cache);
exports.assets = assets;
exports.default = series(assets, parallel(server, watchFiles));
