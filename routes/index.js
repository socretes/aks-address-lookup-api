var express = require('express');
var router = express.Router();
var os = require("os");

/* GET home page. */
router.get('/', function(req, res, next) {
  var pjson = require('../package.json');
  var message = `name: ${pjson.name}`;
  message += `version: ${pjson.version}`;
  message += `description: ${pjson.description}`;
  message += `hostname: ${os.hostname()}`;
  res.send(message);
});

module.exports = router;

