const router = require("../libs/router");
const handlers = require("../controllers/PageController");

router.get("index", handlers.index);
