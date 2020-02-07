const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withImages = require("next-images");
const withFonts = require("next-fonts");

require("dotenv").config();

module.exports = {
  target: "serverless",
  env: {
    URL_SERVER: process.env.URL_SERVER
  },
  ...withSass(withCSS(withImages(withFonts())))
};
