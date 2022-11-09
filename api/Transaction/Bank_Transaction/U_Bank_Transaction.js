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
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'guarantee_id', 'payment_accepted', 'path_image_evidence_of_transfer', 'approval_by', 'created_by', 'posted_by', 'date_approval', 'date_created', 'date_posted', 'date_receipt', 'status_receipt', 'status_escrow_accepted', 'approval_status', 'post_status', 'upload_status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE `
                        + Data.TableName
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
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
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'no_voucher', 'workgroup_id', 'project_id', 'guarantee_id', 'bank_code', 'account_number', 'cheque_number', 'tax_invoice_number', 'invoice_number', 'street_mail_number', 'bank_transaction_desc', 'bank_transaction_date', 'bank_transaction_permission', 'bank_transaction_type', 'transaction_type', 'payment_accepted', 'amount', 'path_image_transaction_type', 'path_image_evidence_of_transfer', 'created_by', 'modified_by', 'posted_by', 'date_created', 'date_modified', 'date_posted', 'date_receipt', 'date_published', 'date_end', 'status_receipt', 'status_escrow_accepted', 'post_status', 'upload_status', 'status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE
                        bank_transaction `
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
                    }
                });
            } else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
        } else if (Data.Route === 'POST_STATUS') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'no_voucher', 'workgroup_id', 'project_id', 'guarantee_id', 'bank_code', 'account_number', 'cheque_number', 'tax_invoice_number', 'invoice_number', 'street_mail_number', 'bank_transaction_desc', 'bank_transaction_date', 'bank_transaction_permission', 'bank_transaction_type', 'transaction_type', 'payment_accepted', 'amount', 'path_image_transaction_type', 'path_image_evidence_of_transfer', 'approval_by', 'created_by', 'modified_by', 'date_approval', 'date_created', 'date_modified', 'date_receipt', 'date_published', 'date_end', 'status_receipt', 'status_escrow_accepted', 'approval_status', 'upload_status', 'status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE
                        bank_transaction `
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
                    }
                });
            } else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
        } else if (Data.Route === 'PAYMENT_ACCEPTED') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'no_voucher', 'workgroup_id', 'project_id', 'guarantee_id', 'bank_code', 'account_number', 'cheque_number', 'tax_invoice_number', 'invoice_number', 'street_mail_number', 'bank_transaction_desc', 'bank_transaction_date', 'bank_transaction_permission', 'bank_transaction_type', 'transaction_type', 'path_image_transaction_type', 'path_image_evidence_of_transfer', 'approval_by', 'created_by', 'modified_by', 'posted_by', 'date_approval', 'date_created', 'date_modified', 'date_posted', 'status_escrow_accepted', 'approval_status', 'post_status', 'upload_status', 'status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE
                        bank_transaction `
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
                    }
                });
            } else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
        } else if (Data.Route === 'ESCROW_ACCEPTED') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'no_voucher', 'workgroup_id', 'project_id', 'guarantee_id', 'bank_code', 'account_number', 'cheque_number', 'tax_invoice_number', 'invoice_number', 'street_mail_number', 'bank_transaction_desc', 'bank_transaction_date', 'bank_transaction_permission', 'bank_transaction_type', 'transaction_type', 'payment_accepted', 'amount', 'path_image_transaction_type', 'path_image_evidence_of_transfer', 'approval_by', 'created_by', 'modified_by', 'posted_by', 'date_approval', 'date_created', 'date_modified', 'date_posted', 'date_receipt', 'date_published', 'date_end', 'status_receipt', 'approval_status', 'post_status', 'upload_status', 'status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE
                        bank_transaction `
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
                    }
                });
            } else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
        } else if (Data.Route === 'UPLOAD_EVIDENCE_OF_TRANSFER') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['bank_transaction_id', 'no_voucher', 'workgroup_id', 'project_id', 'bank_code', 'account_number', 'guarantee_id', 'cheque_number', 'tax_invoice_number', 'invoice_number', 'street_mail_number', 'bank_transaction_desc', 'bank_transaction_date', 'bank_transaction_permission', 'bank_transaction_type', 'transaction_type', 'payment_accepted', 'amount', 'path_image_transaction_type', 'approval_by', 'created_by', 'modified_by', 'posted_by', 'date_approval', 'date_created', 'date_modified', 'date_posted', 'date_receipt', 'date_published', 'date_end', 'status_receipt', 'status_escrow_accepted', 'approval_status', 'post_status', 'status']);

                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE `
                        + Data.TableName
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedbank) => {
                    if (feedbank.Status === 1000) {
                        middleware.Response(res, feedbank);
                    } else {
                        middleware.Response(res, feedbank);
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
            'bank_transaction_date',
            'bank_transaction_permission',
            'modified_by',
            'date_modified',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'APPROVAL') {
        var ColumnArr = [
            'bank_transaction_id',
            'approval_by',
            'date_approval',
            'approval_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'POST_STATUS') {
        var ColumnArr = [
            'bank_transaction_id',
            'posted_by',
            'date_posted',
            'post_status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'PAYMENT_ACCEPTED') {
        var ColumnArr = [
            'bank_transaction_id',
            'payment_accepted',
            'date_receipt',
            'amount',
            'status_receipt'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'ESCROW_ACCEPTED') {
        var ColumnArr = [
            'bank_transaction_id',
            'status_escrow_accepted'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'UPLOAD_EVIDENCE_OF_TRANSFER') {
        var ColumnArr = [
            'bank_transaction_id',
            'path_image_evidence_of_transfer'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}