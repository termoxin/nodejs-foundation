const server = require("./libs/server");
const cluster = require("cluster");
const os = require("os");

let app = {};

app.init = callback => {
  if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    server.init();
  }
};

if (require.main === module) {
  app.init(() => {});
}
