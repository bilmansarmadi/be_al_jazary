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
                        'Field' : 'official_id',
                        'Value' : Data.tableColumn.official_id.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'created_by', 'date_created', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'workgroup_id', 'date_submission', 'paid_status']);                
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
		} else if (Data.Route === 'PAID_STATUS') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [
                        {
                            'Table' : Data.TableName,
                            'Field' : 'submission_number',
                            'Value' : Data.tableColumn.submission_number.value,
                            'Syntax': '='
                        }
                    ]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'submission_number', 'organizational_unit_id', 'work_unit_id', 'position_id', 'position_name', 'official_name', 'official_rank', 'amount_submission', 'amount_checking', 'amount_approval', 'created_by', 'modified_by', 'date_created', 'date_modified', 'status_submission', 'status_checking', 'status_approval', 'status', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'workgroup_id', 'date_submission']);                
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
		} else if (Data.Route === 'PAID_STATUS_BY_OFFICIAL_ID') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [
                        {
                            'Table' : Data.TableName,
                            'Field' : 'official_id',
                            'Value' : JSON.parse(Data.tableColumn.official_id.value),
                            'Syntax': 'IN'
                        }
                    ]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'submission_number', 'organizational_unit_id', 'work_unit_id', 'position_id', 'position_name', 'official_name', 'official_rank', 'amount_submission', 'amount_checking', 'amount_approval', 'created_by', 'modified_by', 'date_created', 'date_modified', 'status_submission', 'status_checking', 'status_approval', 'status', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'workgroup_id', 'date_submission']);                
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
		} else if (Data.Route === 'STATUS_CHECKING') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'submission_number', 'organizational_unit_id', 'work_unit_id', 'position_id', 'position_name', 'official_name', 'official_rank', 'amount_submission', 'amount_checking', 'amount_approval', 'paid_status', 'created_by', 'modified_by', 'date_created', 'date_modified', 'status_submission', 'status_approval', 'status', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'workgroup_id', 'date_submission']);                
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
		} else if (Data.Route === 'STATUS_APPROVAL') {
			if (DataValidation(Data)) {
				var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    }]                
                }; 
			
			    var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'submission_number', 'organizational_unit_id', 'work_unit_id', 'position_id', 'position_name', 'official_name', 'official_rank', 'amount_submission', 'amount_checking', 'amount_approval', 'paid_status', 'created_by', 'modified_by', 'date_created', 'date_modified', 'status_submission', 'status_checking', 'status', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'workgroup_id', 'date_submission']);                
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
            'official_id',
            'modified_by',
            'date_modified'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'PAID_STATUS') {
        var ColumnArr = [
            'paid_status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'PAID_STATUS_BY_OFFICIAL_ID') {
        var ColumnArr = [
            'paid_status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'STATUS_CHECKING') {
        var ColumnArr = [
            'submission_number',
            'status_checking'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'STATUS_APPROVAL') {
        var ColumnArr = [
            'submission_number',
            'status_approval'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}