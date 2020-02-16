var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const city = [
    { id: '0601', name: '贵阳供电局' },
    { id: '0602', name: '六盘水供电局' },
    { id: '0603', name: '遵义供电局' },
    { id: '0604', name: '安顺供电局' },
    { id: '0605', name: '凯里供电局' },
    { id: '0606', name: '兴义供电局' },
    { id: '0607', name: '毕节供电局' },
    { id: '0608', name: '铜仁供电局' },
    { id: '0609', name: '都匀供电局' },
    { id: '0610', name: '贵安供电局' }
  ];
  res.send({ data: city });
});

module.exports = router;
