// Dependencies
const helpers = require("./helpers");
const _api = require("./api/");

// Handlers initialization
let handlers = { ..._api };

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
