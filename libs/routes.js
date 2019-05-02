// Dependencies for routes

const router = require("./router");
const tokens = require("./api/tokens");
const users = require("./api/users");
const handlers = require("./handlers");

// Internal API routes

router.get("api/tokens", tokens.getToken);
router.post("api/tokens", tokens.createToken);
router.put("api/tokens", tokens.updateToken);
router.delete("api/tokens", tokens.deleteToken);

router.get("api/users", users.getUser);
router.post("api/users", users.createUser);
router.put("api/users", users.updateUser);
router.delete("api/users", users.deleteUser);

// Pages
router.get("index", handlers.index);
