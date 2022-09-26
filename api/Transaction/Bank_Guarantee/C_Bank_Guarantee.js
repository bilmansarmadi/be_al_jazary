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
            Data.tableColumn.guarantee_id.value = ID.Read_Id(Data.TableName);

			if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : `CONCAT(guarantee_permission, '-', workgroup_id, '-', DATE_FORMAT(guarantee_date, '%y'), DATE_FORMAT(guarantee_date, '%m'), '-', LPAD(COUNT(no_voucher)+1, 4, '0')) AS ID`,
                    Clause  : "guarantee_date = '"+Data.tableColumn.guarantee_date.value+"' AND workgroup_id = '"+Data.tableColumn.workgroup_id.value+"' AND guarantee_permission = '"+Data.tableColumn.guarantee_permission.value+"' GROUP BY guarantee_date, workgroup_id, guarantee_permission",
                    Return  : 'Data'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified']); 

				let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback.length !== 0) {
                        Data.tableColumn.guarantee_id.value = feedback[0].ID;
                    } else {
                        var date = Data.tableColumn.guarantee_date.value;
                        date = date.split('-');

                        var MM = date[1];
                        var YY = date[0].slice(-2);

                        var format = YY + MM + '-';

                        Data.tableColumn.guarantee_id.value = Data.tableColumn.guarantee_permission.value + `-` + Data.tableColumn.workgroup_id.value + `-` + format + `0001`;
                    }
                    
                    columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

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
            'created_by',
            'status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}