var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Update:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'created_by', 'date_created', 'approval_status', 'allocation_status']);
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
        } else if (Data.Route === 'APPROVAL') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'submission_date', 'submission_desc', 'amount', 'created_by', 'modified_by', 'date_created', 'date_modified', 'allocation_status', 'status']);
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
        } else if (Data.Route === 'ALLOCATION') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'submission_date', 'submission_desc', 'amount', 'approval_by', 'created_by', 'modified_by', 'date_approval', 'date_created', 'date_modified', 'approval_status', 'status']);
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
            'submission_number',
            'workgroup_id',
            'organizational_unit_id',
            'work_unit_id',
            'project_id',
            'submission_date',
            'amount',
            'modified_by',
            'date_modified',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'APPROVAL') {
        var ColumnArr = [
            'submission_number',
            'approval_by',
            'date_approval',
            'approval_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'ALLOCATION') {
        var ColumnArr = [
            'submission_number',
            'allocation_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}