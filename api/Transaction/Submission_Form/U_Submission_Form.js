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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'allocation_status']);
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
        } else if (Data.Route === 'UPDATE_AMOUNT') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_submission', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'allocation_status', 'status_cashing']);
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
        } else if (Data.Route === 'CHECKING') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'date_submission', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_posted', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'approval_status', 'allocation_status', 'status_cashing', 'status']);
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'date_submission', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'checking_by', 'posted_by', 'created_by', 'modified_by', 'date_posted', 'date_posted', 'date_checking', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'allocation_status', 'status_cashing', 'status']);
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'date_submission', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'status_cashing', 'status']);
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
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_submission', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'allocation_status', 'status']);
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
        } else if (Data.Route === 'MONEY_STATUS') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee','checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_submission', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'allocation_status', 'status_cashing', 'status']);
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
        } else if (Data.Route === 'SUBMISSION_STATUS') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_submission', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'post_status', 'checking_status', 'approval_status', 'allocation_status', 'status_cashing', 'status']);
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
        } else if (Data.Route === 'UPLOAD_BANK_GUARANTEE') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'checking_by', 'approval_by', 'posted_by', 'created_by', 'modified_by', 'date_submission', 'date_posted', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'post_status', 'checking_status', 'approval_status', 'allocation_status', 'status_cashing', 'status']);
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
        } else if (Data.Route === 'POSTED') {
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

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['submission_number', 'workgroup_id', 'workgroup_partner_id', 'organizational_unit_id', 'work_unit_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'submission_desc', 'submission_type', 'submission_permission', 'submission_financing', 'transaction_type', 'amount', 'payment_status', 'money_status', 'submission_status', 'path_image_project', 'path_image_bank_guarantee', 'checking_by', 'approval_by', 'created_by', 'modified_by', 'date_submission', 'date_checking', 'date_approval', 'date_created', 'date_modified', 'date_published', 'date_end', 'upload_status', 'checking_status', 'approval_status', 'allocation_status', 'status_cashing', 'status']);
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
            'project_id',
            'date_submission',
            'amount',
            'modified_by',
            'date_modified',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'UPDATE_AMOUNT') {
        var ColumnArr = [
            'submission_number',
            'amount'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'CHECKING') {
        var ColumnArr = [
            'submission_number',
            'checking_by',
            'date_checking',
            'checking_status'
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
    } else if (Data.Route === 'STATUS_CASHING') {
        var ColumnArr = [
            'submission_number',
            'status_cashing'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'MONEY_STATUS') {
        var ColumnArr = [
            'submission_number',
            'money_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'SUBMISSION_STATUS') {
        var ColumnArr = [
            'submission_number',
            'submission_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'UPLOAD_BANK_GUARANTEE') {
        var ColumnArr = [
            'submission_number',
            'path_image_bank_guarantee'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'POSTED') {
        var ColumnArr = [
            'submission_number',
            'posted_by',
            'date_posted',
            'post_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}