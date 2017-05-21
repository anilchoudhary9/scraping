var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
// var routes = require('routes/users');	
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer = require('multer');
var db = mongoose.connection;

var express = require('express');
const _array = require('lodash/array');

const Crawler = require('./crawler');
const CsvConverter = require('./csv-converter');
var app = express();



var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'public'));
//app.set('view engine', 'jade');

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');



// Handle file uploads


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

var users = require('./routes/users');
// Handle Express Sessions
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

// app.use('/', routes);
app.use('/users', users);
app.listen(3000,function(){
	console.log('server running at port 3000');
});


app.post('/scrap',function(req,res){
	console.log(req.body);
	var xo = req.body.tags;
const URL_TO_START = 'https://medium.com/topic/' +xo;
const MAX_PAGES_TO_CRAWL = 15;
const MAX_REQUEST_THROTTLE = 5;
const OUTPUT_CSV_FILE = 'result.csv';

const crawler = new Crawler(MAX_PAGES_TO_CRAWL, MAX_REQUEST_THROTTLE);
crawler.crawl(URL_TO_START)
  .then((/* {foundUrls: Array<{link, text}>, crawledUrls} */ result) => {
    const newResult = { crawledUrls: result.crawledUrls };
    newResult.foundUrls = _array.uniqBy(result.foundUrls, 'link');
    return newResult;
  })
  .then(result => CsvConverter.writeToFile(OUTPUT_CSV_FILE, result.foundUrls));
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
	next(err);
    /*res.render('error', {
      message: err.message,
      error: err
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  next(err);
 /* res.render('error', {
    message: err.message,
    error: {}
  });*/
});


module.exports = app;
