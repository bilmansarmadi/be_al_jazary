var middleware 	= require('nox');
var db 	        = require('nox-db');

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
                        'Field' : 'currency_id',
                        'Value' : Data.tableColumn.currency_id_old.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn  = middleware.ExcludeTableColumn(Data.tableColumn, ['currency_id_old']);
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
            'currency_id',
            'currency_name',
            'local_currency'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}