/**
 * TOKENS | Internal API
 *
 */

const helpers = require("../helpers");
const _data = require("../data");

let tokens = {};

tokens.get = (data, callback) => {
  const { token } = data.queryObject;

  if (token && token.length === 20) {
    _data.read("tokens", token, (err, data) => {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404, err);
      }
    });
  } else {
    callback(500, {
      error: "Required fields weren't given or invalid token length"
    });
  }
};

tokens.post = (data, callback) => {
  const { username } = data.body;

  if (!username) {
    callback(500, { error: "Required fields weren't given." });
  } else {
    const id = helpers.getRandomStr(20);
    _data.create("tokens", id, { id, username, date: +new Date() }, err => {
      if (!err) callback(200, "OK", "plain");
    });
  }
};

tokens.put = (data, callback) => {
  const tokenId = data.body.token;
  const newDate = +new Date() + 1000 * 60 * 60;

  _data.update("tokens", tokenId, { date: newDate }, (err, updatedData) => {
    if (!err) {
      callback(202, updatedData);
    } else {
      callback(500, { error: "Required fields weren't given." });
    }
  });
};

tokens.delete = (data, callback) => {
  const { token } = data.queryObject;

  if (token && token.length === 20) {
    _data.delete("tokens", token, err => {
      if (!err) {
        callback(204);
      } else {
        callback(500, err);
      }
    });
  } else {
    callback(500, {
      error: "Required fields weren't given or invalid token length"
    });
  }
};

module.exports = tokens;
