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
            Data.tableColumn.nilai_id.value = ID.Read_Id(Data.TableName);
            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'nilai_id',
                    Clause  : "nilai_id = '"+ Data.tableColumn.nilai_id.value +"'",
                    Return  : 'Boolean'
                };
                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['nama_lengkap_santri','kode_santri','santri_id','mapel_id','mapel_nama','kode_mapel','nama_kelas']); 

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
            'kelompok_id',
            'tipe_nilai',
            'nilai'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}