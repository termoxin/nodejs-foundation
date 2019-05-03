// Dependencies

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let helpers = {};
helpers.baseDir = path.join(__dirname, "/../templates");

module.exports = helpers;

const _data = require("./data");

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

helpers.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

helpers.getRandomStr = length => {
  const chars = "1234567890abcdefghijklmnopqrstuvwxyz".split("");
  let str = "";

  for (let i = 0; i < length; i++) {
    str += chars[helpers.getRandomInt(0, chars.length)];
  }

  return str;
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

helpers.paintText = (text, color = "green") => {
  const availableColors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37
  };

  color = availableColors.hasOwnProperty(color)
    ? availableColors[color]
    : availableColors["green"];

  return `\x1b[${color}m` + text + "\x1b[0m";
};

helpers.hash = (str, alg = "md5") => {
  return crypto
    .createHash(alg)
    .update(str)
    .digest("hex");
};

helpers.verifyToken = (token, callback) => {
  if (token) {
    _data.read("tokens", token, (err, data) => {
      if (!err && data) {
        if (data.date > +new Date()) {
          callback(200, false);
        } else {
          callback(400, { error: "The token is expired." });
        }
      } else {
        callback(404, { error: "The token does not exist." });
      }
    });
  } else {
    callback({ error: "The username or token are invalid or empty." });
  }
};
