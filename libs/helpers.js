const fs = require("fs");
const path = require("path");

let helpers = {};

helpers.baseDir = path.join(__dirname, "/../templates");

helpers.addUniversalTemplate = (name, payload, callback) => {
  helpers.getTemplate("_header", payload, (err, headerData) => {
    if (!err && headerData) {
      helpers.getTemplate("_footer", payload, (err, footerData) => {
        if (!err && footerData) {
          helpers.getTemplate(name, payload, (err, nameData) => {
            if (!err && nameData) {
              const universalTempalte = headerData + nameData + footerData;
              callback(false, universalTempalte);
            } else {
              callback(`The ${name} template does not exist.`);
            }
          });
        } else {
          callback("The _header template does not exist.");
        }
      });
    } else {
      callback("The _header template does not exist.");
    }
  });
};

helpers.getTemplate = (name, payload, callback) => {
  payload = typeof payload === "object" && payload ? payload : {};

  fs.readFile(`${helpers.baseDir}/${name}.html`, (err, data) => {
    if (!err && data) {
      let dataStr = data.toString();

      helpers.embedPayloadData(dataStr, payload, embeddedData => {
        callback(false, embeddedData);
      });
    } else {
      callback("Could not read the file because it does not exist.");
    }
  });
};

helpers.embedPayloadData = (str, payload, callback) => {
  Object.keys(payload).forEach(key => {
    const value = payload[key];
    const mask = `{${key}}`;
    const regexp = new RegExp(mask, "gi");

    str = str.replace(regexp, value);
  });

  callback(str);
};

helpers.getAssetsData = (fileName, callback) => {
  let contentType = "plain";

  fs.readFile(path.join(__dirname, "/../public", fileName), (err, data) => {
    if (!err && data) {
      if (fileName.indexOf(".css") > -1) {
        contentType = "css";
      }
      if (fileName.indexOf(".js") > -1) {
        contentType = "js";
      }

      if (fileName.indexOf(".svg") > -1) {
        contentType = "svg";
      }

      callback(false, data.toString(), contentType);
    } else {
      callback("There is no such file or directory.");
    }
  });
};

helpers.parseJSONtoObject = json => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
};

// TODO:Parsing this function

helpers.deleteFolderRecursive = (path, callback) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    callback(false);
  } else {
    callback("The database is not created yet.");
  }
};

module.exports = helpers;
