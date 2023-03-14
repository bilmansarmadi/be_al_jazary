var middleware 	= require('../../../assets/nox');
var db 	        = require('../../../assets/nox-db');
var ID          = require('../../../assets/nox-gen-id');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
	Create:function(res, Data) {
		if (Data.Route === 'DEFAULT') {
            Data.tableColumn.pengajar_id.value = ID.Read_Id(Data.TableName);
            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'pengajar_id',
                    Clause  : "pengajar_id = '"+ Data.tableColumn.pengajar_id.value +"'",
                    Return  : 'Boolean'
                };

                 
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
                        ID.Write_Id(Data.TableName);
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
            'nip',
            'nama_lengkap',
            'panggilan',
            'tanggal_lahir',
            'alamat',
            'berat_badan',
            'tinggi_badan',
            'email',
            'hafalan_mutqin',
            'status_nikah',
            'foto'

        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}