/**
 * Internal API
 */
const helpers = require("./helpers");
const _data = require("./data");

let api = {};

api.tokens = {};

api.tokens.post = (data, callback) => {
  const { username } = data.body;

  if (!username) {
    callback(500, "Required fields weren't given.", "plain");
  } else {
    const id = helpers.getRandomStr(20);
    _data.create("tokens", id, { id, username, date: +new Date() }, err => {
      if (!err) callback(200, "OK", "plain");
    });
  }
};

api.tokens.put = (data, callback) => {
  const tokenId = data.body.token;
  const newDate = +new Date() + 1000 * 60 * 60;

  _data.update("tokens", tokenId, { date: newDate }, (err, updatedData) => {
    if (!err) {
      callback(202, updatedData);
    } else {
      callback(500, "Required fields weren't given.", "plain");
    }
  });
};

module.exports = api;
