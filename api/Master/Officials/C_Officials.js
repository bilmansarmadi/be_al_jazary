var middleware          = require('nox');
var db                  = require('nox-db');
var ID                  = require('nox-gen-id');
var submissionNumber    = require('../../Transaction/Submission_Form/C_Submission_Form.js');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Create:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            // Data.tableColumn.official_id.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'official_id',
                    Clause  : "official_id = '"+ Data.tableColumn.official_id.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['official_id', 'modified_by', 'date_created', 'date_modified', 'amount_range_from', 'amount_range_to', 'project_id', 'submission_permission', 'paid_status']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                // let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

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
                            SELECT
                                '`+submissionNumber.SubmissionNumber+`',
                                '`+Data.tableColumn.organizational_unit_id.value+`',
                                '`+Data.tableColumn.work_unit_id.value+`',
                                position_id,
                                position_name,
                                official_name,
                                NULL,
                                0,
                                0,
                                0,
                                '`+Data.tableColumn.created_by.value+`',
                                '`+Data.tableColumn.status_submission.value+`',
                                '`+Data.tableColumn.status_checking.value+`',
                                '`+Data.tableColumn.status_approval.value+`',
                                '`+Data.tableColumn.status.value+`'
                            FROM
                                positions
                            WHERE
                                work_unit_id = '`+Data.tableColumn.work_unit_id.value+`'
                            ;`
                        );
                    } else {
                        return false;
                    }
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
            // 'official_id',
            // 'official_name',
            // 'official_rank',
            // 'amount_submission',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}