const server = require("./libs/server");

let app = {};

app.init = callback => {
  server.init();
};

if (require.main === module) {
  app.init(() => {});
}
