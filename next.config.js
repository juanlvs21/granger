const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = {
  target: "serverless",
  ...withSass(withCSS(withImages(withFonts())))
};
