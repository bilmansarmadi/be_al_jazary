var middleware  = require('nox');
var db          = require('nox-db');
var ID          = require('nox-gen-id');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Create:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            Data.tableColumn.bank_transaction_id.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : `CONCAT(bank_transaction_permission, '-', workgroup_id, '-', DATE_FORMAT(bank_transaction_date, '%y'), DATE_FORMAT(bank_transaction_date, '%m'), '-', LPAD(COUNT(no_voucher)+1, 4, '0')) AS ID`,
                    Clause  : "bank_transaction_date = '"+Data.tableColumn.bank_transaction_date.value+"' AND workgroup_id = '"+Data.tableColumn.workgroup_id.value+"' AND bank_transaction_permission = '"+Data.tableColumn.bank_transaction_permission.value+"' GROUP BY bank_transaction_date, workgroup_id, bank_transaction_permission",
                    Return  : 'Data'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['approval_by', 'modified_by', 'posted_by', 'date_approval', 'date_created', 'date_modified', 'date_posted', 'guarantee_id', 'approval_status', 'post_status']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback.length !== 0) {
                        Data.tableColumn.no_voucher.value = feedback[0].ID;
                    } else {
                        var date = Data.tableColumn.bank_transaction_date.value;
                        date = date.split('-');

                        var MM = date[1];
                        var YY = date[0].slice(-2);

                        var format = YY + MM + '-';

                        Data.tableColumn.no_voucher.value = Data.tableColumn.bank_transaction_permission.value + `-` + Data.tableColumn.workgroup_id.value + `-` + format + `0001`;
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
            'bank_transaction_id',
            'workgroup_id',
            'bank_transaction_date',
            'bank_transaction_permission',
            'amount',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}