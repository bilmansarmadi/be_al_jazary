var middleware 	= require('../../../assets/nox');
var db 	        = require('../../../assets/nox-db');
var md5			= require('../../../assets/md5');


var _Data = {
	Status	: 1000
};

module.exports = {
	Update:function(res, Data) {
		if (Data.Route === 'DEFAULT') {
			if (DataValidation(Data)) {
				var Arr 	= {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'user_id',
                        'Value' : Data.tableColumn.user_id.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param 	= middleware.AdvSqlParamGenerator(Arr); 

                Data.tableColumn.user_password.value = md5(Data.tableColumn.user_password.value);

                Data.tableColumn      = middleware.ExcludeTableColumn(Data.tableColumn, ['user_id']);                
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
            _Data.Status	= 3003;		
            middleware.Response(res, _Data);
        }
	}
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr 	= [
            'user_id'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}