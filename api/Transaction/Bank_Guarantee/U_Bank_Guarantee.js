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
                        'Field' : 'guarantee_id',
                        'Value' : Data.tableColumn.guarantee_idd.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['created_by', 'date_created']);                
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
		} else if (Data.Route === 'STATUS_CASHING') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'guarantee_id',
                        'Value' : Data.tableColumn.guarantee_id.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['workgroup_id', 'project_id', 'bank_code', 'account_number', 'guarantee_address', 'guarantee_permission', 'guarantee_type', 'guarantee_date', 'total_amount', 'date_published', 'date_end', 'created_by', 'modified_by', 'date_created', 'date_modified', 'status']);                
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
            'guarantee_id',
            'workgroup_id',
            'project_id',
            'bank_code',
            'account_number',
            'guarantee_permission',
            'guarantee_date',
            'total_amount',
            'date_published',
            'date_end',
            'modified_by',
            'date_modified',
            'status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'STATUS_CASHING') {
        var ColumnArr = [
            'guarantee_id',
            'status_cashing'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}