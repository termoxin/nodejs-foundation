/**
 * Library for working with data
 *
 */

const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

let _data = {};

_data.baseDir = path.join(__dirname, "/../.data");

_data.read = (collection, name, callback) => {
  fs.readFile(`${_data.baseDir}/${collection}/${name}.json`, (err, data) => {
    if (!err && data) {
      data = helpers.parseJSONtoObject(data);
      callback(false, data);
    } else {
      callback("Could not read the fie because it doesn't exist yet.");
    }
  });
};

// data.create creates a new record or a collection in .data
_data.create = (collection, name, payload, callback) => {
  const payloadObject = JSON.stringify(payload);

  fs.open(
    `${_data.baseDir}/${collection}/${name}.json`,
    "wx+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.writeFile(fileDescriptor, payloadObject, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Could not close the file.");
              }
            });
          } else {
            callback("Could not write the file.");
          }
        });
      } else {
        callback("Could not create because it already exists.");
      }
    }
  );
};

// data.update serves to update an existed record on an existed collection in .data
_data.update = (collection, name, payload, callback) => {
  const payloadObject = JSON.stringify(payload);

  fs.readFile(`${_data.baseDir}/${collection}/${name}.json`, (err, data) => {
    if (!err && data) {
      const dataWaitingFor = helpers.parseJSONtoObject(data.toString());
      let updatedData = { ...dataWaitingFor, ...payload };

      updatedData = JSON.stringify(updatedData);

      fs.writeFile(
        `${_data.baseDir}/${collection}/${name}.json`,
        updatedData,
        err => {
          if (!err) {
            callback(false, updatedData);
          } else {
            callback("Could not write the file.");
          }
        }
      );
    } else {
      callback("Could not create because it already exists.");
    }
  });
};

_data.delete = (collection, name, callback) => {
  fs.unlink(`${_data.baseDir}/${collection}/${name}.json`, err => {
    if (!err) {
      callback(false);
    } else {
      callback("Could not delete the file, probably it does not exist yet.");
    }
  });
};

_data.list = (collection, callback) => {
  fs.readdir(`${_data.baseDir}/${collection}`, (err, files) => {
    if (!err && files) {
      const trimmedPath = files.map(file => file.replace(".json", ""));
      callback(false, trimmedPath);
    } else {
      callback("The collection does not exist yet.");
    }
  });
};

module.exports = _data;
