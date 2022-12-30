var middleware  = require('nox');
var db          = require('nox-db');
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
            Data.tableColumn.cashbank_id.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : `CONCAT(cashbank_type, '-', workgroup_id, '-', DATE_FORMAT(cashbank_date, '%y'), DATE_FORMAT(cashbank_date, '%m'), '-', LPAD(COUNT(no_voucher)+1, 4, '0')) AS ID`,
                    Clause  : "cashbank_date = '"+Data.tableColumn.cashbank_date.value+"' AND workgroup_id = '"+Data.tableColumn.workgroup_id.value+"' AND cashbank_type = '"+Data.tableColumn.cashbank_type.value+"' GROUP BY cashbank_date, workgroup_id, cashbank_type",
                    Return  : 'Data'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified', 'guarantee_id', 'post_status', 'daily_monthly', 'date_from', 'date_to']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback.length !== 0) {
                        Data.tableColumn.no_voucher.value = feedback[0].ID;
                    } else {
                        var date = Data.tableColumn.cashbank_date.value;
                        date = date.split('-');

                        // var DD = date[2];
                        var MM = date[1];
                        var YY = date[0].slice(-2);

                        var format = YY + MM + '-';

                        Data.tableColumn.no_voucher.value = Data.tableColumn.cashbank_type.value + `-` + Data.tableColumn.workgroup_id.value + `-` + format + `0001`;
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
                        `)
                        ;`
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
            'cashbank_id',
            // 'no_voucher',
            'workgroup_id',
            'project_id',
            // 'period_code',
            'cashbank_date',
            'cashbank_type',
            'amount',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}