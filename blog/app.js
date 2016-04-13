var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 引入flash
var flash = require('connect-flash');
// 数据操作相应的引入
var mongodb=require('mongodb');
var mongoose=require('mongoose')
// session
var session=require('express-session');
// var MongoStore = require('connect-mongo')(session);u
//连接数据库
global.dbHelper=require('./dbbase/dbHelper');
global.db=mongoose.connect('mongodb://localhost:27017/myblog');
global.db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
global.db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

// 路由
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session
app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
