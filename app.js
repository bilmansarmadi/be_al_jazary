var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter               = require('./routes/index');
var absensiRouter             = require('./api/Transaction/Absensi/Absensi');
var kelompokkelasRouter       = require('./api/Transaction/Kelompok_Kelas/Kelompok_Kelas');
var rpendidikanRouter         = require('./api/Transaction/Riwayat_Pendidikan_Santri/Riwayat_Pendidikan_Santri');
var rdikpengajarRouter        = require('./api/Transaction/Riwayat_Pendidikan_Pengajar/Riwayat_Pendidikan_Pengajar');
var rmengajarRouter           = require('./api/Transaction/Riwayat_Mengajar/Riwayat_Mengajar');
var riwayatnilaiRouter        = require('./api/Transaction/Riwayat_Nilai/Riwayat_Nilai');
var usersRouter               = require('./api/Master/Users/Users');
var roleUserRouter            = require('./api/Master/Role_User/Role_User');
var menuRouter                = require('./api/Master/Menu/Menu');
var pengajarRouter            = require('./api/Master/Pengajar/Pengajar');
var mapelRouter               = require('./api/Master/Mapel/Mapel');
var tahunajaranRouter         = require('./api/Master/Tahun_Ajaran/Tahun_Ajaran');
var gradenilaiRouter          = require('./api/Master/Grade_Nilai/Grade_Nilai');
var kelasRouter               = require('./api/Master/Kelas/Kelas');
var santriRouter              = require('./api/Master/Santri/Santri');
var pengajaranRouter          = require('./api/Master/Pengajaran/Pengajaran');
var rprivilegeRouter          = require('./api/Master/Rprivilege/Rprivilege');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/', express.static(path.join(__dirname, 'public')));
app.use('/api/', indexRouter);

app.use('/api/Riwayat/Absensi', absensiRouter);
app.use('/api/Riwayat/Riwayat_Pendidikan_Santri', rpendidikanRouter);
app.use('/api/Riwayat/Riwayat_Pendidikan_Pengajar', rdikpengajarRouter);
app.use('/api/Riwayat/Riwayat_Nilai', riwayatnilaiRouter);
app.use('/api/Riwayat/Riwayat_Mengajar', rmengajarRouter);
app.use('/api/Riwayat/Kelompok_Kelas', kelompokkelasRouter);
app.use('/api/Master/Users', usersRouter);
app.use('/api/Master/RoleUser', roleUserRouter);
app.use('/api/Master/TahunAjaran', tahunajaranRouter);
app.use('/api/Master/Kelas', kelasRouter);
app.use('/api/Master/Menu', menuRouter);
app.use('/api/Master/Pengajar', pengajarRouter);
app.use('/api/Master/Santri', santriRouter);
app.use('/api/Master/Mapel', mapelRouter);
app.use('/api/Master/GradeNilai', gradenilaiRouter);
app.use('/api/Master/Pengajaran', pengajaranRouter);
app.use('/api/Master/Privilege', rprivilegeRouter);

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
