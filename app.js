var express = require('express');
var path = require('path');
var cons = require('consolidate');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csvWriter = require('csv-write-stream');
var fs = require('fs');
var writerHackers = csvWriter();
writerHackers.pipe(fs.createWriteStream('hackers.csv'));
var writerSponsors = csvWriter();
writerSponsors.pipe(fs.createWriteStream('sponsors.csv'));
var writerContact = csvWriter();
writerContact.pipe(fs.createWriteStream('contacts.csv'));
var zip = require('express-zip');

/*var mailer = require('nodemailer');

mailer.SMTP = {
	host: 'gmail.com',
	port:587,
	use_authentication:true,
	user:"msthackathon@mst.edu",
	pass:"5haMHack5"
};*/


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/registerHacker', function(req, res) {
	try
	{
	console.log('here');
	console.log(req.body);
	console.log(req.body.fname);
	console.log(req.body.lname);
	console.log(req.body.email);
	console.log(req.body.foodrestrictions);
	console.log(req.body.electronicsrequested);
	console.log(req.body.shirtsize);
	console.log(req.body.age);
	writerHackers.write({firstName: req.body.fname, lastName: req.body.lname, email:req.body.email, food:req.body.foodrestrictions, electron:req.body.electronicsrequested, shirtsize:req.body.shirtsize, age:req.body.age});
	
	res.send("Successfully registered!")
	} catch(ex) {
		console.log(ex);
		res.send("Failed with ex "+ex);
	}
});

app.get('/downloadthefilesforthehackathon', function(req, res) {
  res.zip([
    { path: 'hackers.csv', name: 'hackers.csv' },
    { path: 'sponsors.csv', name: 'sponsors.csv' },
    { path: 'contacts.csv', name: 'contacts.csv' }
  ]);
});


app.post('/registerSponsor', function(req, res) {
	try
	{
	console.log('here');
	console.log(req.body);
	console.log(req.body.fname);
	console.log(req.body.lname);
	console.log(req.body.email);
	console.log(req.body.companyName);
	console.log(req.body.howSponsor);
	console.log(req.body.shirtsize);
	writerSponsors.write({firstName: req.body.fname, lastName: req.body.lname, email:req.body.email, companyName:req.body.companyName, message:req.body.howSponsor, shirtsize:req.body.shirtsize});
	
	res.send("Successfully registered!")
	} catch(ex) {
		console.log(ex);
		res.send("Failed with ex "+ex);
	}
});

app.post('/contact', function(req, res) {
	try
	{
	console.log('here');
	console.log(req.body);
	console.log(req.body.name);
	console.log(req.body.email);
	console.log(req.body.message);
	
	writerContact.write({name: req.body.name, email:req.body.email, message:req.body.message});
	
	res.send("Successfully contacted!")
	} catch(ex) {
		console.log(ex);
		res.send("Failed with ex "+ex);
	}
});

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
  res.render('error');
});



module.exports = app;
