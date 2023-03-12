var middleware 	= require('nox');;
var db 	        = require('nox-db');
var ID          = require('nox-gen-id');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
	Create:function(res, Data) {
		if (Data.Route === 'DEFAULT') {
            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : 'm_pengajaran',
                    Field   : 'jadwal_id',
                    Clause  : "jadwal_id = '"+ Data.tableColumn.jadwal_id.value +"'",
                    Return  : 'Boolean'
                };
				Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['jadwal_id','nama_kelas','nip','mapel_nama','kode_mapel','nama_lengkap','nama_kelas']); 

				let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback) {
                        return db.Transaction(
                            `INSERT INTO `
                                + Data.TableName + ` 
                            (`
                                + columnNameString +   
                            `) 
                            VALUES 
                            (`
                                + columnValueString +
                            `);`
                        );
                    } else {
                        return false;
                    }
                }).then((feedback) => {
                    if (feedback !== false) {
                        middleware.Response(res, feedback);
                    } else {
                        _Data.Status = 3006;
                        middleware.Response(res, _Data);
                    }
                });
			} else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
		} else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
	}
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr = [
            'jam_mulai',
            'jam_akhir',
            'pengajar_id',
            'mapel_id',
            'tahun_id',
            'hari',
            'kelas_id'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}