# Very Good Plus

## Technologies Used

- [ThemeKit](https://shopify.github.io/themekit/#use-a-new-theme)
- [Webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [Vue](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/guide/)
- [Axios](https://www.npmjs.com/package/axios)
- [Lazysizes](https://github.com/aFarkas/lazysizes)

## Start

To install and start the build process watcher, simply run `npm run start`

## Development

To start development, run `npm run watch` **FIRST** to compile and watch; once webpack is done compiling, run `theme watch` in a separate terminal to connect to Shopify and allow these locally developed files to be watched and pushed to Shopify

If we want to change the location website, simply modify the `config.yml` file, updating the `password`, `theme_id`, and `store` parameters to point to the correct store

## Production

To build a production payload, run `npm run build`, and run `theme deploy` after it has finished to upload the payload to Shopify using `theme deploy`
