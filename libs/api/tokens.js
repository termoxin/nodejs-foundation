/**
 * TOKENS | Internal API
 *
 */

const helpers = require("../helpers");
const _data = require("../data");

let tokens = {};

tokens.getToken = (data, callback) => {
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

tokens.createToken = (data, callback) => {
  let { username, password } = data.body;

  username = username && username.trim().length > 3 ? username : false;
  password = password && password.trim().length >= 6 ? password : false;

  if (username && password) {
    _data.read("users", username, (err, data) => {
      const hashedPassword = helpers.hash(password);
      if (!err && data && hashedPassword === data.password) {
        const id = helpers.getRandomStr(20);
        const data = {
          id,
          username,
          date: +new Date() + 1000 * 60 * 60
        };

        _data.create("tokens", id, data, err => {
          if (!err) callback(200, data);
        });
      } else {
        callback(500, {
          error: "The password is invalid or the user doesn't exist yet."
        });
      }
    });
  } else {
    callback(500, { error: "Required fields weren't given." });
  }
};

tokens.updateToken = (data, callback) => {
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

tokens.deleteToken = (data, callback) => {
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
