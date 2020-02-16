var express = require('express');
var router = express.Router();
var mongodb = require('../lib/mongodb');
var xlsx = require('node-xlsx');
var fs = require('fs');


router.get('/', function (req, res, next) {
  mongodb.db('find', {
    collection: 'transformer'
  }, function (err, docs) {
    if (err) {
      return next(new DatabaseError('数据库查询失败', 500, err));
    } else {
      let data = [['供电局ID', '线路ID', '变压器ID', '变压器名称']];
      let options = { '!cols': [{ wch: 9 }, { wch: 15.5 }, { wch: 15.5 }, { wch: 11 }] };
      for (let doc of docs) {
        let row = [doc.cityId, doc.branchId, doc.id, doc.name];
        data.push(row);
      }
      let excelBuffer = xlsx.build([{ name: "变压器清单", data: data }], options); // Returns a buffer
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = '变压器数据导出成功';
      res.body.data = excelBuffer;
      res.send(res.body);
    }
  })
});

module.exports = router;
