const express = require("express");


const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const Path = require("path");
// const router = express.Router();
const app = express();
// const server = require("http").createServer(app)
// const io = require("socket.io")(server)

const port = 3000;
const ObserveClass = require("./Observe");
let data = require('./Storage/data.json')

// app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());


// Init Observe object
let Observe = new ObserveClass();

let targetFolder = "D:\\Projects\\7.ViewImage\\Data";


// Listen event new file has been added
Observe.on("new file has been added", (logData) => {
  console.log(logData.message);
});

Observe.watchFolder(targetFolder);


app.get('/data', function (req, res) {
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(data));
})


app.post("/getdata", (req, res) => {
  var idx = req.body.idx;
  var newname = req.body.newname;
  fs.readdir("../Data", (err, files) => {
    var oldname = files[idx];
    for (i = 0; i < files.length; i++) {
      if (newname === files[i]) {
        return res.send("Your name is already taken");
      }
      console.log(files);
    }
    fs.rename(`../Data/${oldname}`, `../Data/${newname}`, function (err) {
      if (err) throw err;
    });
    res.send("The image was successfully renamed");
  });
});

app.post("/deldata", (req, res) => {
  var newname = req.body.newname;
  fs.readdir("../Data", (err, files) => {
    fs.unlink(`../Data/${newname}`, function (err) {
      if (err) throw err;
    });
    res.send("The image was successfully deleted");
  });
});


// io.on('connection', function(socket){
//   console.log("user connect")

//   socket.on( 'messages', function(data) {
//     console.log( 'Message received ' + data.type + ":" + data.fruit );
// });
// });

app.listen(port, () => {
  console.log(`express server listening on port ${port}!`);
});

