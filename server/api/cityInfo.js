var express = require('express');
var mongodb = require('../lib/mongodb');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  mongodb.db('find', {
    collection: 'city',
    conditions: {
      province: '贵州省'
    }
  }, function (err, docs) {
    if (err) {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = err.name;
      res.body.data = err;
    } else {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'Get cities Success';
      res.body.data = docs;
    }
    res.send(res.body);
  })
});

module.exports = router;
