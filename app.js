var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var busboy = require('connect-busboy');
// var index = require('./routes/index');
// var users = require('./routes/users');
var web_Router = require('./routes/web_router');
// 引入模板引擎
var engine = require('ejs-mate');
var app = express();
var Config = require('./config');
// markdowm的第三方转换工具
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();

// view engine setup,配置模板引擎
app.engine('html',engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


// 为了在前台可以接受到session值
// app.use(function(req, res, next){
//     res.locals.session = req.session;
//     next();
// });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 处理文件上传的第三方插件
app.use(busboy());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(function(req, res, next){
//     req.session._garbage = Date();
//     req.session.touch();
//     next();
// });
// app.use(cookieParser());
// app.use(session({
//     secret: 'dsfjdsfjdslfjlsdjfl',
//     store: new RedisStore({
//         port: 6379,
//         host: '127.0.0.1'
//         // ttl:60*60*24*1
//     }),
//     resave: true,
//     saveUninitialized: true
// }))
// 新的session创建
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'name',
    cookie: {maxAge: 600000},
    resave: false,
    saveUninitialized: true,
}));
app.use(logger('dev'));

app.use('/public',express.static(path.join(__dirname, 'public')));

app.locals.config=Config;
//引入md作为local
app.locals.md=md;
//用于记录用户是否登录
app.use(function(req, res, next){
    app.locals.current_user = req.session.user;
    next();
});
// app.use('/', index);
// app.use('/users', users);
app.use('/', web_Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // //中的响应代码是异步的，
  //   但在它响应之前，也就是最下面的一句“res.send(body);”已经把响应流关闭了。
  // res.render('error');
});

app.listen(3000);
module.exports = app;
