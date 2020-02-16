var express = require('express');
var router = express.Router();
var mongodb = require('../lib/mongodb');

router.get('/', function (req, res, next) {
  let conditions = {};
  if (req.query) conditions = req.query;
  mongodb.db('find', {
    collection: 'branch',
    conditions: conditions
  }, function (err, docs) {
    if (err) {
      res.body.status = 500;
      res.body.statusText = 'Failed';
      res.body.message = err.name;
      res.body.data = err;
    } else {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = 'Get branches Success';
      res.body.data = docs;
    }
    res.send(res.body);
  })
});

router.get('/:id', function (req, res, next) {
  mongodb.db('find', {
    collection: 'branch',
    conditions: {
      cityId: req.params.id
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
      res.body.message = 'Get branch Success';
      res.body.data = docs;
    }
    res.send(res.body);
  })
});

module.exports = router;
