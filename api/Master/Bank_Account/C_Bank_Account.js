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
                    Table   : 'bank_account',
                    Field   : 'account_number',
                    Clause  : "account_number = '"+ Data.tableColumn.account_number.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['account_number_old', 'modified_by', 'date_created', 'date_modified']); 

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
            'account_number',
            'bank_code',
            'currency_id',
            'workgroup_id',
            'coa_code',
            'account_name',
            'account_type',
            'current_balance',
            'prev_balance',
            'created_by',
            'status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}