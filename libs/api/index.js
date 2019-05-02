/**
 *  INDEX | Internal API
 *
 */

// Dependencies
const tokens = require("./tokens");
const users = require("./users");
const router = require("../router");

// API routes

let api = {
  tokens,
  users
};

module.exports = api;
