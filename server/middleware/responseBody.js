class ResBodyModel {
  status = '';
  statusText = '';
  message = '';
  data = {};
}

/* define express middleware */
function responseInfo(req, res, next) {
  res.body = new ResBodyModel();
  next();
}

module.exports = responseInfo;
