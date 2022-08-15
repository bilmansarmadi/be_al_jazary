var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter     = require('./routes/index');
var accountingPeriodRouter  = require('./api/Master/Accounting_Period/Accounting_Period');
var bankRouter              = require('./api/Master/Bank/Bank');
var bankAccountRouter       = require('./api/Master/Bank_Account/Bank_Account');
var bankGuaranteeRouter     = require('./api/Master/Bank_Guarantee/Bank_Guarantee');
var cashbankRouter          = require('./api/Transaction/Cashbank/Cashbank');
var cashbankDetailRouter    = require('./api/Transaction/Cashbank_Detail/Cashbank_Detail');
var coaRouter               = require('./api/Master/Coa/Coa');
var coaTypeRouter           = require('./api/Master/Coa_Type/Coa_Type');
var currencyRouter          = require('./api/Master/Currency/Currency');
var divisionRouter          = require('./api/Master/Division/Division');
var exchangeRateRouter      = require('./api/Master/Exchange_Rate/Exchange_Rate');
var guaranteeTypeRouter     = require('./api/Master/Guarantee_Type/Guarantee_Type');
var journalRouter           = require('./api/Transaction/Journal/Journal');
var projectRouter           = require('./api/Master/Project/Project');
var usersRouter             = require('./api/Master/Users/Users');
var workgroupRouter         = require('./api/Master/Workgroup/Workgroup');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);

app.use('/api/Master/AccountingPeriod', accountingPeriodRouter);
app.use('/api/Master/Bank', bankRouter);
app.use('/api/Master/BankAccount', bankAccountRouter);
app.use('/api/Master/BankGuarantee', bankGuaranteeRouter);
app.use('/api/Transaction/Cashbank', cashbankRouter);
app.use('/api/Transaction/CashbankDetail', cashbankDetailRouter);
app.use('/api/Master/Coa', coaRouter);
app.use('/api/Master/CoaType', coaTypeRouter);
app.use('/api/Master/Currency', currencyRouter);
app.use('/api/Master/Division', divisionRouter);
app.use('/api/Master/ExchangeRate', exchangeRateRouter);
app.use('/api/Master/GuaranteeType', guaranteeTypeRouter);
app.use('/api/Transaction/Journal', journalRouter);
app.use('/api/Master/Project', projectRouter);
app.use('/api/Master/Users', usersRouter);
app.use('/api/Master/Workgroup', workgroupRouter);

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
