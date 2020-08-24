const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events").EventEmitter;

let log = console.log.bind(console);
let fileLocation = path.join(__dirname, "Data/");

class Observe extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(fileLocation) {
    try {
      // initialize watcher
      const watcher = chokidar.watch(".", {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        cwd: fileLocation,
      });

      // listen when a file has been added
      watcher.on("add", async (filepath) => {
        if (filepath.includes(".jpg") || filepath.includes(".png")) {
          // log(`File ${filepath} has been added`);
          var obj = {
            table: [],
          };
          fs.readdir("../Data/", (err, files) => {
            files.forEach((file) => {
              // console.log(file);
              obj.table.push(file);
            });
            fs.writeFile("./Storage/data.json", JSON.stringify(obj), (err) => {
              if (err) {
                console.error(err);
                return;
              }
              // console.log("File has been created");
            });
          });
        }
      });

      // listen when a file has been removed
      watcher.on("unlink", async (filepath) => {
        if (filepath.includes(".jpg") || filepath.includes(".png")) {
          log(`File ${filepath} has been remove`);
          var str = path.basename(filepath);
          var obj = {
            table: [],
          };
          fs.readdir("../Data/", (err, files) => {
            log(files);
            obj.table = files;
            fs.writeFile("./Storage/data.json", JSON.stringify(obj), (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          });
        }
      });
    } catch (err) {
      log(err.toString());
      // res.status(500).json({ message: "error ", error });
    }
  }
}

module.exports = Observe;
