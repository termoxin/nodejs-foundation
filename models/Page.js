const _data = require("../libs/data");

class Page {
  static getUsers(callback) {
    _data.list("users", (err, users) => {
      if (!err && users) return callback(users);

      callback(false);
    });
  }
}

module.exports = Page;
