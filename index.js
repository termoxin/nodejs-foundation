const server = require("./libs/server");
const cli = require("./libs/cli");

let app = {};

app.init = callback => {
  server.init();

  setTimeout(() => {
    cli.init();
  }, 50);
};

if (require.main === module) {
  app.init(() => {});
}
