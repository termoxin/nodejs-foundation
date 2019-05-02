// Dependencies
const helpers = require("./helpers");
const _api = require("./api/");

// Handlers initialization
let handlers = { ..._api };

handlers.index = {};

handlers.index = (data, callback) => {
  const payload = { title: "Index", description: "This is description" };

  helpers.addUniversalTemplate("index", payload, (err, data) => {
    if (!err && data) {
      callback(200, data, "html");
    }
  });
};

handlers.public = (data, callback) => {
  const pathname = data.address.pathname;
  const fileName = pathname.replace("/public/", "");

  helpers.getAssetsData(fileName, (err, assetsData, contentType) => {
    if (!err && assetsData && contentType) {
      callback(200, assetsData, contentType);
    } else {
      callback(404, err, contentType);
    }
  });
};

module.exports = handlers;
