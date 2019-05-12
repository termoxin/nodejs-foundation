/**
 *  INDEX | Internal API
 *
 */

// Dependencies
const tokens = require("./tokens");
const users = require("./users");

// API routes

let api = {
  tokens,
  users
};

module.exports = api;
