var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.query.postcode === "EH1 1HE"){
    res.send({
      "_items": [
        {
          "addressLine1": "1 Castle Street",
          "addressLine2": "string",
          "addressLine3": "string",
          "city": "Edinburgh",
          "county": "string",
          "postcode": "EH1 1HE"
        }
      ]
    });
  }

  res.send({
    "_items": []
  });
});

module.exports = router;
