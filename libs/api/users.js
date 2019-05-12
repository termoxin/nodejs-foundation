/**
 * USERS | Internal API
 *
 */

// Dependencies
const _data = require("../data");
const helpers = require("../helpers");

let users = {};

users.getUser = (data, callback) => {
  let { username } = data.queryObject;
  let { token } = data.headers;

  if (username.trim().length >= 3 && token) {
    _data.isExists("users", username, isExists => {
      if (isExists) {
        _data.read("users", username, (err, userData) => {
          if (!err && userData) {
            if (userData.isAdmin) {
              helpers.verifyToken(token, (statusCode, data) => {
                if (statusCode === 200) {
                  delete userData.password;

                  callback(200, userData);
                } else {
                  callback(statusCode, data);
                }
              });
            } else {
              callback(403, { error: "Forbidden. You don't have an access." });
            }
          }
        });
      } else {
        callback(404, { error: "The user does not exist yet." });
      }
    });
  }
};

users.createUser = (data, callback) => {
  let { username, firstName, lastName, password, image } = data.body;

  username = username && username.trim().length > 3 ? username : false;
  password = password && password.trim().length >= 6 ? password : false;
  image = image ? image : null;

  if (username && firstName && lastName && password) {
    const hash = helpers.hash(password);

    const id = helpers.getRandomStr(20);

    const data = {
      id,
      username,
      firstName,
      lastName,
      password: hash,
      image
    };

    _data.isExists("users", username, isExists => {
      if (!isExists) {
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

users.updateUser = (data, callback) => {
  let preparedForUpdate = {};
  let { username, newUserName, lastName, firstName, password } = data.body;

  if (data.headers.token) {
    helpers.verifyToken(data.headers.token, (statusCode, err) => {
      if (!err && statusCode === 200) {
        if (password) {
          preparedForUpdate.password = helpers.hash(password);
        }

        if (lastName) {
          preparedForUpdate.lastName = lastName;
        }
        if (firstName) {
          preparedForUpdate.firstName = firstName;
        }

        if (!username) {
          callback(400, { error: "The username was missed." });
        }

        if (newUserName) {
          _data.isExists("users", newUserName, isExists => {
            if (!isExists) {
              preparedForUpdate.username = newUserName;
            } else {
              callback(434, { error: "The user already exists." });
            }
          });
        }

        if (!!Object.keys(preparedForUpdate).length) {
          _data.update("users", username, preparedForUpdate, (err, data) => {
            if (!err && data) {
              delete data.password;

              _data.rename("users", username, newUserName, err => {
                if (!err) {
                  callback(200);
                } else {
                  callback(500);
                }
              });

              callback(202, data);
            } else {
              callback(500, err);
            }
          });
        } else {
          callback(500, {
            error: "The fields are empty, enter something, please."
          });
        }
      } else {
        callback(500, { error: "Invalid token." });
      }
    });
  } else {
    callback(500, { error: "Token is required." });
  }
};

users.deleteUser = (data, callback) => {
  const { username } = data.queryObject;
  const { token } = data.headers;

  helpers.verifyToken(token, (_, err) => {
    if (!err) {
      _data.isExists("users", username, isExists => {
        if (isExists) {
          _data.delete("users", username, err => {
            if (!err) {
              callback(204);
            } else {
              callback(500, { error: "Could not delete the user." });
            }
          });
        } else {
          callback(404, { error: "The user does not exist." });
        }
      });
    } else {
      callback(500, err);
    }
  });
};

module.exports = users;
