# Contributing

There are several ways you can help:

- [translations](#translations)
- [adding tests](#adding-tests)
- [fixing issues](#fixing-issues)

# Explanation of technology stack

https://hackernoon.com/a-basic-react-redux-introductory-tutorial-adcc681eeb5e
https://github.com/ivantsov/redux-webext

# Translations

# Adding tests

# Fixing issues

# react-webextension-boilerplate

This is a boilerplate to aim on bootstrap a [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) application with `React.js` easily.

Following is some benefits when you use this boilerplate:
* Lightweight boilerplate and easy to understand and config
* Support Hot Reload and source map to develop easily
* `React@16` and `Webpack2` supported

## Getting Statred

### Setup

```sh
$ git clone https://github.com/shopback/react-webextension-boilerplate
$ cd react-webextension-boilerplate
$ yarn install
```

> `extension` folder contain some static assets, like extension icon and manifest

### Development

Run following command to start develop a browser extension:

```sh
$ yarn start
```

After webpack bundle successfully, you will see `build-dev` folder will be created in the root folder. This folder is a temporary extension for development.  Now, you can open your modern browser and load it.

When development, you can change the `popup` and `background` scripts, `webpack` will reload the extension automatically instead of reload it manually.   
Above mechanism is work well on Chrome and Firefox currently.

### Production

Run following command to get your extension to production ready:

```sh
$ yarn run build
```

The final result will be writed to `build-prod` folder. Same as development, you can config the output path in `config/paths` file.

### Testing

