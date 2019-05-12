// Please, don't wipe this!

const pages = require("./pages");
const router = require("../libs/router");
const tokens = require("../libs/api").tokens;
const users = require("../libs/api").users;

router.get("api/tokens", tokens.getToken);
router.post("api/tokens", tokens.createToken);
router.put("api/tokens", tokens.updateToken);
router.delete("api/tokens", tokens.deleteToken);

router.get("api/users", users.getUser);
router.post("api/users", users.createUser);
router.put("api/users", users.updateUser);
router.delete("api/users", users.deleteUser);
