# Very Good Plus 2.0

## Technologies Used

- [Shopify CLI](https://github.com/Shopify/shopify-cli)
- [Webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [Vue](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/guide/)
- [Lazysizes](https://github.com/aFarkas/lazysizes)

## Start

First, install Shopify CLI, ensure you have access to the Partners Portal, and login to the store using `shopify login --store=SHOPIFY_STORE_URL`

To install and start the build process watcher, simply run `npm run start`

## Development

To start development, run `npm run watch` **FIRST** to compile and watch (the above process will do this for you).

Once webpack is done compiling, run `shopify theme serve` in a separate terminal to spin up a local development environment.


## Production

To build a production payload, run `npm run build`, and run `shopify theme push` after it has finished to upload the payload to Shopify.

**NOTE**: When pushing the theme, ensure you select the proper theme to push to; you should never be pushing to the live theme, only a copy.
