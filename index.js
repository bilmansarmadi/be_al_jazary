var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter               = require('./routes/index');
var absensiRouter             = require('./api/Transaction/Absensi/Absensi');
var kelompokkelasRouter       = require('./api/Transaction/Absensi/Absensi');
var rpendidikanRouter         = require('./api/Transaction/Riwayat_Pendidikan_Santri/Riwayat_Pendidikan_Santri');
var rdikpengajarRouter        = require('./api/Transaction/Riwayat_Pendidikan_Pengajar/Riwayat_Pendidikan_Pengajar');
var rmengajarRouter           = require('./api/Transaction/Riwayat_Mengajar/Riwayat_Mengajar');
var riwayatnilaiRouter        = require('./api/Transaction/Riwayat_Nilai/Riwayat_Nilai');
var usersRouter               = require('./api/Master/Users/Users');
var roleUserRouter            = require('./api/Master/Role_User/Role_User');
var menuRouter                = require('./api/Master/Menu/Menu');
var pengajarRouter            = require('./api/Master/Pengajar/Pengajar');
var mapelRouter               = require('./api/Master/Mapel/Mapel');
var kurikulumRouter            = require('./api/Master/Kurikulum/Kurikulum');
var kategoriRouter            = require('./api/Master/Kategori/Kategori');
var tahunajaranRouter         = require('./api/Master/Tahun_Ajaran/Tahun_Ajaran');
var gradenilaiRouter          = require('./api/Master/Grade_Nilai/Grade_Nilai');
var kelasRouter               = require('./api/Master/Kelas/Kelas');
var santriRouter              = require('./api/Master/Santri/Santri');
var pengajaranRouter          = require('./api/Master/Pengajaran/Pengajaran');
var rprivilegeRouter          = require('./api/Master/Rprivilege/Rprivilege');

var index = express();

// view engine setup
index.set('views', path.join(__dirname, 'views'));
index.set('view engine', 'jade');

index.use(logger('dev'));
index.use(express.json());
index.use(express.urlencoded({ extended: false }));
index.use(cookieParser());
index.use('/api/', express.static(path.join(__dirname, 'public')));
index.use('/api/', indexRouter);

index.use('/api/Riwayat/Absensi', absensiRouter);
index.use('/api/Riwayat/Riwayat_Pendidikan_Santri', rpendidikanRouter);
index.use('/api/Riwayat/Riwayat_Pendidikan_Pengajar', rdikpengajarRouter);
index.use('/api/Riwayat/Riwayat_Nilai', riwayatnilaiRouter);
index.use('/api/Riwayat/Riwayat_Mengajar', rmengajarRouter);
index.use('/api/Riwayat/Kelompok_Kelas', kelompokkelasRouter);
index.use('/api/Master/Users', usersRouter);
index.use('/api/Master/RoleUser', roleUserRouter);
index.use('/api/Master/TahunAjaran', tahunajaranRouter);
index.use('/api/Master/Kelas', kelasRouter);
index.use('/api/Master/Menu', menuRouter);
index.use('/api/Master/Pengajar', pengajarRouter);
index.use('/api/Master/Santri', santriRouter);
index.use('/api/Master/Mapel', mapelRouter);
index.use('/api/Master/GradeNilai', gradenilaiRouter);
index.use('/api/Master/Pengajaran', pengajaranRouter);
index.use('/api/Master/Privilege', rprivilegeRouter);
index.use('/api/Master/Kurikulum', kurikulumRouter);
index.use('/api/Master/Kategori', kategoriRouter);


// catch 404 and forward to error handler
index.use(function(req, res, next) {
  next(createError(404));
});

// error handler
index.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.index.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = index;
