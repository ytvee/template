// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require("@vue/cli-service");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = defineConfig({
  productionSourceMap: false,
  parallel: false,
    chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Deep Noise Studio';
      return args;
    });
  },
  configureWebpack: {
    devServer: {
      historyApiFallback: true,
      headers: { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" },
    },
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ProvidePlugin({
        process: ["process/browser"],
      }),
    ],
    resolve: {
      extensions: [".ts", ".js"],
      fallback: {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),

        /* web3auth */
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert"),
        os: require.resolve("os-browserify"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        url: require.resolve("url"),
        zlib: require.resolve("browserify-zlib"),
        /* /web3auth */
      },
      alias: {
        "@audioeditor": path.resolve(__dirname, "src/audioeditor"),
      },
    },
    /* AWS IVS */
    module: {
      rules: [
        {
          /**
           * Developers packaging the IVS player into an app are required to resolve and import the following assets via URL:
           *
           * 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm'
           * 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';
           *
           * These assets must not be re-compiled during packaging. Your build tool must import these files as-is, untranspiled.
           * The webpack file-loader (https://webpack.js.org/loaders/file-loader/) accomplishes this.
           * Rollup's plugin-url (https://github.com/rollup/plugins/tree/master/packages/url) also seems to do this, but has not been tested.
           */
          // eslint-disable-next-line
          test: /[\/\\]amazon-ivs-player[\/\\].*dist[\/\\]assets[\/\\]/,
          loader: "file-loader",
          type: "javascript/auto",
          options: {
            name: "[name].[ext]",
          },
        },
        /* audio worklets */
        {
          test: /\.worklet\.ts$/,
          use: [
            {
              loader: "audio-worklet-loader",
            },
            {
              loader: "ts-loader",
            },
          ],
        },
        /* /audio worklets */
      ],
    },
    /* /AWS IVS */
  },
});
