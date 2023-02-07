var middleware 	= require('nox');
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
                    Table   : Data.TableName,
                    Field   : 'kelompok_id',
                    Clause  : "kelompok_id = '"+ Data.tableColumn.kelompok_id.value +"'",
                    Return  : 'Boolean'
                };
                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['nama_lengkap_santri','kode_santri','mapel_nama','kode_mapel','kelompok_id']); 

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
		}else if (Data.Route === 'KELOMPOK_KELAS') {          
            if (DataValidation(Data)) {
            var Query_Insert_Value_List = '';
            var Array_Santri = [];
            Array_Santri = Data.tableColumn.santri_id.value.split(',');
            for(i=0; i< Array_Santri.length; i++){
                var kelompok_id = [];
           
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'kelompok_id',
                    Clause  : "kelompok_id = '"+ Data.tableColumn.kelompok_id.value +"'",
                    Return  : 'Boolean'
                };

                var santri_id = Array_Santri[i];
                Query_Insert_Value_List = Query_Insert_Value_List + `('${Data.tableColumn.jadwal_id.value}','${santri_id}'),`;
            }
            var index = Query_Insert_Value_List.lastIndexOf(",");
            Query_Insert_Value_List = Query_Insert_Value_List.substring(0, index) + Query_Insert_Value_List.substring(index + 1);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback) {
                        return db.Transaction(
                            `INSERT INTO `
                                + Data.TableName + ` 
                            (
                            jadwal_id,
                             santri_id
                            ) 
                            VALUES `
                           + Query_Insert_Value_List 
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
		}else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
	}
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr = [
            'jadwal_id',
            'santri_id'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}