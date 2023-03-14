var middleware 	= require('../../../assets/nox');
var db 	        = require('../../../assets/nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
	Update:function(res, Data) {
		if (Data.Route === 'DEFAULT') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'absensi_id',
                        'Value' : Data.tableColumn.absensi_id.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['nama_lengkap_santri','mapel_id','kelas_id','tahun_id','pengajar_id']); 
                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);
				
				db.Transaction(
                    `UPDATE ` 
                        + Data.TableName
                        + columnValueString +`
                    WHERE 
						1=1 ` + Param
                ).then((feedback) => {
                    if (feedback.Status === 1000) {
                        middleware.Response(res, feedback);
                    } else {
                        middleware.Response(res, feedback);
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
            'absensi_id'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}