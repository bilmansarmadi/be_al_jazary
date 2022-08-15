var middleware 	= require('nox');
var db 	        = require('nox-db');

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
                    Field   : `CONCAT('PRD-', DATE_FORMAT(period_start, '%d'), '-', DATE_FORMAT(period_start, '%m'), '-', DATE_FORMAT(period_start, '%Y'), '-', LPAD(COUNT(period_code)+1, 3, '0')) AS ID`,
                    Clause  : "period_start = '"+Data.tableColumn.period_start.value+"' GROUP BY period_start",
                    Return  : 'Data'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified']); 

				let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback.length !== 0) {
                        Data.tableColumn.period_code.value = feedback[0].ID;
                    } else {
                        var period_start = Data.tableColumn.period_start.value;
                        period_start = period_start.split('-');

                        var DD = period_start[2];
                        var MM = period_start[1];
                        var YY = period_start[0];

                        var format = DD + '-' + MM + '-' + YY + '-';

                        Data.tableColumn.period_code.value = `PRD-` + format + `001`;
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
            'period_start',
            'period_end',
            'created_by',
            'status'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}