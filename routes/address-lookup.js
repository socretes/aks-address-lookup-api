var express = require('express');
var router = express.Router();

const axios = require('axios');

router.get('/', (req, res) => {
  axios.get('http://LAPTOP-B68T9PQR:8090/mock/address-lookup-api')
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.error(error);
    });
}) 

module.exports = router;
