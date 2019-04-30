/**
 * USERS | Internal API
 *
 */

// Dependencies
const crypto = require("crypto");
const _data = require("../data");
const helpers = require("../helpers");

let users = {};

users.post = (data, callback) => {
  let { username, firstName, lastName, password } = data.body;

  username = username && username.trim().length > 3 ? username : false;
  password = password && password.trim().length >= 6 ? password : false;

  if (username && firstName && lastName && password) {
    const hash = crypto
      .createHash("md5")
      .update(username)
      .digest("hex");

    const id = helpers.getRandomStr(20);

    const data = {
      id,
      username,
      firstName,
      lastName,
      password: hash
    };

    _data.isExist("users", username, isExist => {
      if (!isExist) {
        _data.create("users", username, data, err => {
          if (!err) {
            callback(201, { status: "OK" });
          } else {
            callback(434, err);
          }
        });
      } else {
        callback(434, { error: "This user already exists." });
      }
    });
  } else {
    callback(434, { error: "Some fields are invalid or empty." });
  }
};

module.exports = users;
