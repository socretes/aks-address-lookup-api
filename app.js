var createError = require('http-errors');	
var express = require('express');	
var path = require('path');	app = express();	
var logger = require('morgan');	

var indexRouter = require('./routes/index');	  
var addressLookupRouter = require('./routes/address-lookup');

var app = express();	

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api.json');

app.use('/apidef', function(req, res, next){
  var pjson = require('./package.json');
  var os = require("os");
  swaggerDocument.info.description = `Component version: ${pjson.version}, Executed on hostname: ${os.hostname()}`;
  swaggerDocument.host = `${process.env.SWAGGER_ENDPOINT || 'localhost:8080'}`;
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUi.serve, swaggerUi.setup());

app.use(logger('dev'));	
app.use(express.json());	
app.use(express.urlencoded({ extended: false }));			

app.use('/', indexRouter);	
app.use('/group/lookups/address-lookup', addressLookupRouter);	

// catch 404 and forward to error handler	
app.use(function(req, res, next) {	
  next(createError(404));	
});	

// error handler	
app.use(function(err, req, res, next) {	
  // set locals, only providing error in development	
  res.locals.message = err.message;	
  res.locals.error = req.app.get('env') === 'development' ? err : {};	

  // send 500
  res.status(err.status || 500);	
});	


module.exports = app;
