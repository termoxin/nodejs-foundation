const availableContentTypes = {
  html: "text/html",
  json: "application/json",
  plain: "text/plain",
  js: "text/javascript",
  css: "text/css",
  svg: "image/svg+xml"
};

const developmentConfig = {
  PORT: 3000,
  HOST: "localhost",
  availableContentTypes
};

const productionConfig = {
  PORT: 5000,
  HOST: "",
  availableContentTypes
};

const config =
  process.env.NODE_ENV !== "production" ? developmentConfig : productionConfig;

module.exports = config;
