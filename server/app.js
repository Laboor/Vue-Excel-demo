var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var boot = require('./boot');
var responseBody = require('./middleware/responseBody');
require('./global/Error');

var createData = require('./createData');

var cityInfoApi = require('./api/cityInfo');
var branchInfoApi = require('./api/branchInfo');
var transInfoApi = require('./api/transInfo');
var upload = require('./api/upload');
var exportFile = require('./api/export');

var app = express();

//Setting header befor the Router
app.use(function (req, res, next) {
  res.header('Content-Language', 'zh-cn');
  res.header('Cache-Control', 'no-cache');
  res.header('Access-Control-Allow-Origin', req.headers.origin); // CORS
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Max-Age', '1000');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(responseBody);

app.use('/api/cityInfo', cityInfoApi);
app.use('/api/branchInfo', branchInfoApi);
app.use('/api/transInfo', transInfoApi);
app.use('/api/upload', upload);
app.use('/api/export', exportFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); 
  res.send(err);
});

// Startup settings
boot();

// setTimeout(() => {
//   createData();
//   console.log('create data compelet!');
// }, 3000);


module.exports = app;
