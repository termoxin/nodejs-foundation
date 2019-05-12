// Dependencies

const helpers = require("../libs/helpers");
const Page = require("../models/Page");

let PageController = {};

PageController.index = (data, callback) => {
  const payload = { title: "Index", description: "This is description" };

  helpers.addUniversalTemplate("index", payload, (err, data) => {
    if (!err && data) {
      callback(200, data, "html");
    }
  });
};

module.exports = PageController;
