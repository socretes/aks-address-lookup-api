var express = require('express');
var router = express.Router();

const axios = require('axios');

router.get('/', (req, res) => {
  axios.get(process.env.ADDRESS_LOOKUP_REMOTE_URL)
    .then(response => {
      res.send(response.data)
    })
    .catch(error => {
      res.status(500).send(`Error retrieving address from '${process.env.ADDRESS_LOOKUP_REMOTE_URL}'`);
    });
}) 

module.exports = router;
