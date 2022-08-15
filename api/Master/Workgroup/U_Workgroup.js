var middleware 	= require('nox');
var db 	        = require('nox-db');

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
                        'Field' : 'workgroup_id',
                        'Value' : Data.tableColumn.workgroup_id_old.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param 	= middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn      = middleware.ExcludeTableColumn(Data.tableColumn, ['workgroup_id_old', 'created_by', 'date_created']);                
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
            'workgroup_id',
            'modified_by',
            'date_modified'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}