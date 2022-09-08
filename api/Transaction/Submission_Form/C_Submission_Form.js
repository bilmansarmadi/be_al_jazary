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
            // Data.tableColumn.submission_number.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : `CONCAT('OPS', '-', workgroup_id, '-', DATE_FORMAT(submission_date, '%y'), DATE_FORMAT(submission_date, '%m'), '-', LPAD(COUNT(submission_number)+1, 4, '0')) AS ID`,
                    Clause  : "submission_date = '"+Data.tableColumn.submission_date.value+"' AND workgroup_id = '"+Data.tableColumn.workgroup_id.value+"' AND submission_date = '"+Data.tableColumn.submission_date.value+"' GROUP BY submission_date, workgroup_id",
                    Return  : 'Data'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['approval_by', 'modified_by', 'date_approval', 'date_created', 'date_modified', 'approval_status', 'allocation_status']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback.length !== 0) {
                        Data.tableColumn.submission_number.value = feedback[0].ID;
                    } else {
                        var date = Data.tableColumn.submission_date.value;
                        date = date.split('-');

                        var MM = date[1];
                        var YY = date[2].slice(-2);

                        var format = YY + MM + '-';

                        Data.tableColumn.submission_number.value = `OPS` + `-` + Data.tableColumn.workgroup_id.value + `-` + format + `0001`;
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
                        // ID.Write_Id(Data.TableName);
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
            // 'submission_number',
            'workgroup_id',
            'organizational_unit_id',
            'work_unit_id',
            'project_id',
            'submission_date',
            'amount',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}