var multer = require('multer');
var xlsx = require('node-xlsx');
var fs = require('fs');


function xlsxParser(options) {
  let storage;
  if (options.storage == 'disk') {
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, options.filesPath);
      },
      filename: function (req, file, cb) {
        cb(null, 'file' + '-' + Date.now());
      }
    });
  } else if (options.storage == 'memory') {
    storage = multer.memoryStorage();
  } else {
    storage = multer.memoryStorage();
  }
  let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!options.fileType) {
        cb(null, true);
        return;
      }
      if (options.fileType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('文件类型错误'));
      }
    },
    limits: {
      fileSize: options.limitSize || 10485760,
      files: options.limitFiles || 5
    }
  }).single(options.fieldname);
  return function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        return next(new UploadError('上传文件失败', 400, err));
      } else {
        if (!req.file) {
          return next(new UploadError('未获取到上传的文件', 400));
        }
        let excelBuffer = options.storage == 'disk' ?
          fs.readFileSync(`${req.file.path}`) : req.file.buffer;
        req.excel = xlsx.parse(excelBuffer);
        next();
      }
    })
  }
}

module.exports = xlsxParser;
