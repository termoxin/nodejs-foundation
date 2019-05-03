/**
 * Library for working with data
 *
 */

const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

let _data = {};

_data.baseDir = path.join(__dirname, "/../.data");

/**
 * @TODO Fix circular dependency
 */

_data.read = (collection, id, callback) => {
  fs.readFile(`${_data.baseDir}/${collection}/${id}.json`, (err, data) => {
    if (!err && data) {
      data = helpers.parseJSONtoObject(data);
      callback(false, data);
    } else {
      callback({
        error: "Could not read the flie because it doesn't exist yet."
      });
    }
  });
};

// data.create creates a new record or a collection in .data
_data.create = (collection, id, payload, callback) => {
  const payloadObject = JSON.stringify(payload);

  fs.open(
    `${_data.baseDir}/${collection}/${id}.json`,
    "wx+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.writeFile(fileDescriptor, payloadObject, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback({ error: "Could not close the file." });
              }
            });
          } else {
            callback({ error: "Could not write the file." });
          }
        });
      } else {
        callback({ error: "Could not create because it already exists." });
      }
    }
  );
};

// data.update serves to update an existed record on an existed collection in .data
_data.update = (collection, id, payload, callback) => {
  fs.readFile(`${_data.baseDir}/${collection}/${id}.json`, (err, data) => {
    if (!err && data) {
      const dataWaitingFor = helpers.parseJSONtoObject(data.toString());
      let updatedData = { ...dataWaitingFor, ...payload };

      updatedData = JSON.stringify(updatedData);

      fs.writeFile(
        `${_data.baseDir}/${collection}/${id}.json`,
        updatedData,
        err => {
          if (!err) {
            callback(false, updatedData);
          } else {
            callback({ error: "Could not write the file." });
          }
        }
      );
    } else {
      callback({ error: "Could not update because it does not exist yet." });
    }
  });
};

_data.delete = (collection, id, callback) => {
  fs.unlink(`${_data.baseDir}/${collection}/${id}.json`, err => {
    if (!err) {
      callback(false);
    } else {
      callback({
        error: "Could not delete the file, probably it does not exist yet."
      });
    }
  });
};

_data.list = (collection, callback) => {
  fs.readdir(`${_data.baseDir}/${collection}`, (err, files) => {
    if (!err && files) {
      const trimmedPath = files.map(file => file.replace(".json", ""));
      callback(false, trimmedPath);
    } else {
      callback({ error: "The collection does not exist yet." });
    }
  });
};

_data.isExists = (collection, id, callback) => {
  _data.read(collection, id, (err, data) => {
    if (!err && data) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

_data.rename = (collection, id, newName, callback) => {
  fs.rename(
    `${_data.baseDir}/${collection}/${id}.json`,
    `${_data.baseDir}/${collection}/${newName}.json`,
    err => {
      if (!err) {
        callback(false);
      } else {
        callback({ error: "Could not change the file name." });
      }
    }
  );
};

module.exports = _data;
