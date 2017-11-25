var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methhods", "GET,HEAD,OPTIONS,POST,PUT");
   res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
   next();
});

const port = 8081;
var workspaces = false;
var oldWorkspaces = false;

function runServer(){
  app.get('/workspaces', (req, res) => {
    res.send(workspaces)
  });

  app.options('/workspaces', (req, res) => {
    res.send(); 
  });

  app.post('/workspaces', (req, res) => {
    console.log("New workspaces received!");

    oldWorkspaces = workspaces;
    fs.writeFile('workspaces.bak', oldWorkspaces);

    workspaces = JSON.stringify(req.body);

    fs.writeFile('workspaces', workspaces);

    res.set('Access-Control-Allow-Origin', '*');
    res.send("Success");
  });

  app.listen(port, () => console.log('ARVP server running on port ' + port));
}

fs.readFile('workspaces', (err, data) => {
  if (err) throw err;

  workspaces = data;

  runServer();
});