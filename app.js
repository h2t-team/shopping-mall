const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./component/homepage');
const productRouter = require('./component/product');
const authRouter = require('./component/auth');
const cartRouter = require('./component/cart');
const orderRouter = require('./component/order');
const hbs = require('hbs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'component'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/component/partials', function (err) {});
hbs.registerHelper('productDetail', id =>  "/product/"+id);
hbs.registerHelper('page', num => {
  var item = "";
  for(let i =1 ; i <= num/9+1; i++){
    item += "<li><a href=\"?page="+i+"\">"+i+"</a></li>\n";
  }
  return item;
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/order',orderRouter);


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
