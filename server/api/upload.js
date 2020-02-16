var express = require('express');
var router = express.Router();
var mongodb = require('../lib/mongodb');
var xlsxParser = require('../middleware/xlsxParser');

let options = {
  fieldname: 'file',
  storage: 'memory',
  fileType: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
}

router.post('/', xlsxParser(options), function (req, res, next) {
  let xlsxData = req.excel[0].data;
  if (xlsxData[0][0] != '变压器ID' || xlsxData[0][1] != '变压器名称') {
    throw new UploadError('表格的表头不符合要求', 400);
  }
  let insertData = [];
  for (let i = 1; i < xlsxData.length; i++) {
    insertData.push({
      id: xlsxData[i][0],
      name: xlsxData[i][1],
      branchId: req.body.branchId,
      cityId: req.body.cityId
    });
  }
  mongodb.db('add', {
    collection: 'transformer',
    data: insertData
  }, function (err, docs) {
    if (err) {
      return next(new DatabaseError('数据库插入表格数据错误', 500, err));
    } else {
      res.body.status = 200;
      res.body.statusText = 'Success';
      res.body.message = '变压器数据插入成功';
      res.body.data = docs;
    }
    res.send(res.body);
  });
});

module.exports = router;
