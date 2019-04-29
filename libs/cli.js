/**
 *  CLI for managing application state
 *
 */

// Dependencies
const events = require("events");
const readline = require("readline");
const path = require("path");
const fs = require("fs");
const helpers = require("./helpers");

class _events extends events {}
const e = new _events();

let cli = {};

cli.baseDir = path.join(__dirname, "/../.data");
cli.baseTemplateDir = path.join(__dirname, "/../templates");

cli.responders = {};

cli.responders.help = () => {
  let commands = {
    help: "Show help page",
    "database:create": "Create database with specific name",
    "database:delete": "Delete database with specific name",
    "template:create": "Create template with specific name"
  };

  cli.horizontalLine();
  cli.centered("DOCUMENTATION");
  cli.horizontalLine();
  cli.verticalSpace(2);

  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      let line = "";
      let command = helpers.paintText("     " + key, "yellow");

      line += command;
      let padding = 60 - line.length;

      for (let i = 0; i < padding; i++) {
        line += " ";
      }

      line += commands[key];

      console.log(line);
      cli.verticalSpace();
    }
  }
};

/**
 * TODO: Make highlighting the error about invalid name
 * TODO: Make success highlighting
 */

cli.responders.databaseCreate = str => {
  const dbName = str.split(" ")[1];

  if (typeof dbName !== "undefined") {
    fs.mkdir(`${cli.baseDir}/${dbName}`, err => {
      if (!err || err.code !== "EEXIST") {
        console.log(
          helpers.paintText(`The database ${dbName} was created successfully.`)
        );
        cli.verticalSpace();
      } else {
        console.log(
          helpers.paintText(
            "The database with this name already exists.",
            "red"
          )
        );
      }
    });
  } else {
    console.log("Database name is invalid, try again.");
  }
};

cli.responders.databaseDelete = str => {
  const dbName = str.split(" ")[1];

  helpers.deleteFolderRecursive(`${cli.baseDir}/${dbName}`, err => {
    if (!err) {
      console.log(
        helpers.paintText(`The database ${dbName} was deleted succesfully.`)
      );
    } else {
      console.log(
        helpers.paintText(`The database ${dbName} does not exist yet.`, "red")
      );
    }
  });
};

cli.responders.templateCreate = str => {
  const templateName = str.split(" ")[1];

  fs.open(`${cli.baseTemplateDir}/${templateName}.html`, "wx+", err => {
    if (!err || err.code !== "EEXIST") {
      console.log(
        helpers.paintText(
          `The template ${templateName}.html was created succesfully.`
        )
      );
    } else {
      console.log(
        helpers.paintText(
          `The template ${templateName}.html already exists.`,
          "red"
        )
      );
    }
  });
};

e.on("help", cli.responders.help);
e.on("database:create", cli.responders.databaseCreate);
e.on("database:delete", cli.responders.databaseDelete);
e.on("template:create", cli.responders.templateCreate);

cli.horizontalLine = () => {
  const width = process.stdout.columns;

  let line = "";

  for (i = 0; i < width; i++) {
    line += "-";
  }

  console.log(line);
};

cli.verticalSpace = lines => {
  lines = typeof lines === "number" ? lines : 1;

  for (let i = 0; i < lines; i++) {
    console.log("");
  }
};

cli.centered = str => {
  str = typeof str === "string" && str.trim().length > 0 ? str : false;

  const width = Math.round((process.stdout.columns - str.length) / 2);
  let centeredText = "";

  for (let i = 0; i < width; i++) {
    centeredText += " ";
  }

  centeredText += str;

  console.log(centeredText);
};

cli.processInput = str => {
  str = typeof str === "string" && str.trim().length > 0 ? str : false;

  if (str) {
    const uniqueInputs = [
      "help",
      "database:create",
      "database:delete",
      "template:create"
    ];

    let matchFound = false;

    uniqueInputs.some(input => {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;

        e.emit(input, str);
        return true;
      }
    });

    if (!matchFound) {
      console.log("Sorry, try again!");
    }
  }
};

cli.init = () => {
  console.log("The CLI is running!");

  const _interface = readline.createInterface({
    input: process.stdin,
    prompt: ""
  });

  _interface.prompt();

  _interface.on("line", str => {
    cli.processInput(str);

    _interface.prompt();
  });

  _interface.on("close", () => {
    process.exit(0);
  });
};

module.exports = cli;
