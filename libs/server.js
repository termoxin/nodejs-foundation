const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");
const querystring = require("querystring");
const util = require("util");
const debug = util.debuglog("server");
const config = require("./config");
const handlers = require("./handlers");
const helpers = require("./helpers");
const router = require("./router");
const routes = require("../routes");

let server = {};

server.httpServer = () => {
  const httpServer = http.createServer(server.requestHandler);

  httpServer.listen(config.PORT, config.HOST, () => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Server's listening in port: ${config.PORT}`
    );
  });
};

server.collectRequestData = (request, callback) => {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  const APPLICATION_JSON = "application/json";

  const decoder = new StringDecoder("utf8");

  if (
    request.headers["content-type"] === FORM_URLENCODED ||
    request.headers["content-type"] === APPLICATION_JSON
  ) {
    let body = "";
    request.on("data", chunk => {
      body += decoder.write(chunk);
    });

    request.on("end", () => {
      body = typeof body === "string" ? helpers.parseJSONtoObject(body) : {};
      callback(body);
    });
  } else {
    callback({});
  }
};

server.requestHandler = (req, res) => {
  const address = url.parse(req.url);
  const queryObject = querystring.parse(address.query);
  const pathname = address.pathname.replace(/^\/+|\/+$/gi, "");
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const availableMethods = ["get", "post", "put", "delete"];

  server.collectRequestData(req, body => {
    let data = {
      address,
      body,
      headers,
      method,
      queryObject
    };

    if (availableMethods.indexOf(method) > -1) {
      let chosenHandler =
        router.routes.hasOwnProperty(method) &&
        router.routes[method].hasOwnProperty(pathname)
          ? router.routes[method][pathname]
          : server.notFound;

      chosenHandler =
        address.pathname.indexOf("/public") > -1
          ? handlers.public
          : chosenHandler;

      chosenHandler(data, (statusCode, payload, contentType) => {
        payload =
          typeof payload === "string" && typeof payload !== "undefined"
            ? payload
            : JSON.stringify(payload);

        contentType = typeof contentType === "string" ? contentType : "json";

        if (config.availableContentTypes.hasOwnProperty(contentType)) {
          res.writeHead(statusCode, {
            "Content-Type": config.availableContentTypes[contentType]
          });
          res.end(payload);
        }

        if (statusCode === 200) {
          debug(
            `\x1b[32m%s\x1b[0m`,
            `${method.toUpperCase()} ${pathname} ${statusCode}`
          );
        } else {
          debug(
            "\x1b[31m%s\x1b[0m",
            `${method.toUpperCase()} ${pathname} ${statusCode}`
          );
        }
      });
    }
  });
};

server.init = () => {
  server.httpServer();
};

server.notFound = (_, callback) => {
  callback(404, "Not found");
};

module.exports = server;
