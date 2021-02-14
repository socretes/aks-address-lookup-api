var express = require('express');
var router = express.Router();

const axios = require('axios');

router.get('/', (req, res) => {
  axios.get(process.env.ADDRESS_LOOKUP_REMOTE_URL)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.error(error);
    });
}) 

module.exports = router;
