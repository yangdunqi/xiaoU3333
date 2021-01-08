var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');    
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listRouter = require('./routes/list');
var showsRouter = require('./routes/show');
var searchRouter = require('./routes/search');

var app = express();

//允许跨域调用：
app.use('*', (req, res, next) => { 
  res.header("Access-Control-Allow-Origin",  "*");  // 开启跨域支持
  res.header("Access-Control-Allow-Headers",  "*");  // 跨域时, 允许前端携带的请求头字段
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));  // 模板存放地址
app.set('view engine', 'ejs');    // 配置模板引擎
app.engine('html',require('ejs').__express);    // 允许html当做模板引擎

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));     // 获取post请求
app.use(cookieParser());    
app.use(express.static(path.join(__dirname, 'public')));  // 托管静态资源

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use(listRouter);
app.use(showsRouter);
app.use(searchRouter);

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
  res.render('error');
});

module.exports = app;
