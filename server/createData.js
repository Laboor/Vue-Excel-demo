const mongodb = require('./lib/mongodb');

// const myData = [
//   { id: '79000491103101', name: '10kV贵龙线', cityId: '0601' },
//   { id: '79000491103102', name: '10kV贵乌线', cityId: '0601' },
//   { id: '79000491103103', name: '10kV新铁线', cityId: '0602' },
//   { id: '79000491103104', name: '10kV都电线', cityId: '0602' },
//   { id: '79000491103105', name: '10kV新华线', cityId: '0603' },
//   { id: '79000491103106', name: '10kV汇川线', cityId: '0603' },
//   { id: '79000491103107', name: '10kV市西线', cityId: '0604' },
//   { id: '79000491103108', name: '10kV宝山线', cityId: '0604' },
//   { id: '79000491103109', name: '10kV瑞金线', cityId: '0605' },
//   { id: '79000491103110', name: '10kV白云线', cityId: '0605' },
//   { id: '79000491103111', name: '10kV金阳线', cityId: '0606' },
//   { id: '79000491103112', name: '10kV南明线', cityId: '0606' },
//   { id: '79000491103113', name: '10kV云岩线', cityId: '0607' },
//   { id: '79000491103114', name: '10kV花溪线', cityId: '0607' },
//   { id: '79000491103115', name: '10kV乌当线', cityId: '0608' },
//   { id: '79000491103116', name: '10kV息烽线', cityId: '0608' },
//   { id: '79000491103117', name: '10kV开阳线', cityId: '0609' },
//   { id: '79000491103118', name: '10kV修文线', cityId: '0609' },
//   { id: '79000491103119', name: '10kV五环线', cityId: '0610' },
//   { id: '79000491103120', name: '10kV北京线', cityId: '0610' }
// ];

const myData = [
  { id: '0601', name: '贵阳供电局', province: '贵州省'},
  { id: '0602', name: '六盘水供电局', province: '贵州省' },
  { id: '0603', name: '遵义供电局', province: '贵州省' },
  { id: '0604', name: '安顺供电局', province: '贵州省' },
  { id: '0605', name: '凯里供电局', province: '贵州省' },
  { id: '0606', name: '兴义供电局', province: '贵州省' },
  { id: '0607', name: '毕节供电局', province: '贵州省' },
  { id: '0608', name: '铜仁供电局', province: '贵州省' },
  { id: '0609', name: '都匀供电局', province: '贵州省' },
  { id: '0610', name: '贵安供电局', province: '贵州省' }
]

function createData() {
  mongodb.db('add', {
    collection: 'city',
    data: myData
  }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
    }
  });
}

module.exports = createData;
