var middleware  = require('nox');
var db          = require('nox-db');
var Setup       = require('nox-config');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Read:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/bank-transaction/';

            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_permission',
                        'Value' : Data.tableColumn.bank_transaction_permission.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_type',
                        'Value' : Data.tableColumn.bank_transaction_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'transaction_type',
                        'Value' : Data.tableColumn.transaction_type.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    bank_transaction.bank_transaction_id,
                    bank_transaction.no_voucher,
                    bank_transaction.workgroup_id,
                    bank_transaction.project_id,
                    bank_transaction.guarantee_id,
                    bank_transaction.bank_code,
                    bank_transaction.account_number,
                    bank_transaction.guarantee_id,
                    bank_transaction.cheque_number,
                    bank_transaction.tax_invoice_number,
                    bank_transaction.invoice_number,
                    bank_transaction.street_mail_number,
                    bank_transaction.bank_transaction_desc,
                    CONVERT(DATE_FORMAT(bank_transaction.bank_transaction_date, "%d-%m-%Y"), CHAR(20)) AS bank_transaction_date,
                    bank_transaction.bank_transaction_type,
                    bank_transaction.bank_transaction_permission,
                    bank_transaction.transaction_type,
                    bank_transaction.payment_accepted,
                    bank_transaction.amount,
                    CASE 
                        WHEN bank_transaction.path_image != '' THEN
                            CONCAT('`+ Url_Img +`', bank_transaction.path_image) 
                        ELSE ''
                    END AS path_image,
                    bank_transaction.approval_by,
                    bank_transaction.created_by,
                    bank_transaction.modified_by,
                    bank_transaction.posted_by,
                    CONVERT(DATE_FORMAT(bank_transaction.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(bank_transaction.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(bank_transaction.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(bank_transaction.date_posted, "%d-%m-%Y"), CHAR(20)) AS date_posted,
                    CONVERT(DATE_FORMAT(bank_transaction.date_receipt, "%d-%m-%Y"), CHAR(20)) AS date_receipt,
                    CONVERT(DATE_FORMAT(bank_transaction.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(bank_transaction.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
                    bank_transaction.status_receipt,
                    bank_transaction.status_escrow_accepted,
                    bank_transaction.approval_status,
                    bank_transaction.post_status,
                    bank_transaction.status,
                    workgroup.workgroup_name,
                    project.project_name,
                    bank.bank_name
                FROM
                    bank_transaction
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = bank_transaction.workgroup_id
                INNER JOIN
                    project ON project.project_id = bank_transaction.project_id
                INNER JOIN
                    bank ON bank.bank_code = bank_transaction.bank_code
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'ESCROW_PAYMENT_ACCEPTED') {
            var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/bank-transaction/';

            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_permission',
                        'Value' : Data.tableColumn.bank_transaction_permission.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'transaction_type',
                        'Value' : Data.tableColumn.transaction_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'payment_accepted',
                        'Value' : Data.tableColumn.payment_accepted.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'status_receipt',
                        'Value' : Data.tableColumn.status_receipt.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'status_escrow_accepted',
                        'Value' : Data.tableColumn.status_escrow_accepted.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    bank_transaction.bank_transaction_id,
                    bank_transaction.no_voucher,
                    bank_transaction.workgroup_id,
                    bank_transaction.project_id,
                    bank_transaction.guarantee_id,
                    bank_transaction.bank_code,
                    bank_transaction.account_number,
                    bank_transaction.guarantee_id,
                    bank_transaction.cheque_number,
                    bank_transaction.tax_invoice_number,
                    bank_transaction.invoice_number,
                    bank_transaction.street_mail_number,
                    bank_transaction.bank_transaction_desc,
                    CONVERT(DATE_FORMAT(bank_transaction.bank_transaction_date, "%d-%m-%Y"), CHAR(20)) AS bank_transaction_date,
                    bank_transaction.bank_transaction_type,
                    bank_transaction.bank_transaction_permission,
                    bank_transaction.transaction_type,
                    bank_transaction.payment_accepted,
                    bank_transaction.amount,
                    CASE 
                        WHEN bank_transaction.path_image != '' THEN
                            CONCAT('`+ Url_Img +`', bank_transaction.path_image) 
                        ELSE ''
                    END AS path_image,
                    bank_transaction.approval_by,
                    bank_transaction.created_by,
                    bank_transaction.modified_by,
                    bank_transaction.posted_by,
                    CONVERT(DATE_FORMAT(bank_transaction.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(bank_transaction.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(bank_transaction.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(bank_transaction.date_posted, "%d-%m-%Y"), CHAR(20)) AS date_posted,
                    CONVERT(DATE_FORMAT(bank_transaction.date_receipt, "%d-%m-%Y"), CHAR(20)) AS date_receipt,
                    CONVERT(DATE_FORMAT(bank_transaction.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(bank_transaction.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
                    bank_transaction.status_receipt,
                    bank_transaction.status_escrow_accepted,
                    bank_transaction.approval_status,
                    bank_transaction.post_status,
                    bank_transaction.status,
                    workgroup.workgroup_name,
                    project.project_name,
                    bank.bank_name
                FROM
                    bank_transaction
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = bank_transaction.workgroup_id
                INNER JOIN
                    project ON project.project_id = bank_transaction.project_id
                INNER JOIN
                    bank ON bank.bank_code = bank_transaction.bank_code
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'LAST_TRANSFER') {
            var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/bank-transaction/';

            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_id',
                        'Value' : Data.tableColumn.bank_transaction_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_permission',
                        'Value' : Data.tableColumn.bank_transaction_permission.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'bank_transaction_type',
                        'Value' : Data.tableColumn.bank_transaction_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'transaction_type',
                        'Value' : Data.tableColumn.transaction_type.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    bank_transaction.bank_transaction_id,
                    bank_transaction.no_voucher,
                    bank_transaction.workgroup_id,
                    bank_transaction.project_id,
                    bank_transaction.guarantee_id,
                    bank_transaction.bank_code,
                    bank_transaction.account_number,
                    bank_transaction.guarantee_id,
                    bank_transaction.cheque_number,
                    bank_transaction.tax_invoice_number,
                    bank_transaction.invoice_number,
                    bank_transaction.street_mail_number,
                    bank_transaction.bank_transaction_desc,
                    CONVERT(DATE_FORMAT(bank_transaction.bank_transaction_date, "%d-%m-%Y"), CHAR(20)) AS bank_transaction_date,
                    bank_transaction.bank_transaction_type,
                    bank_transaction.bank_transaction_permission,
                    bank_transaction.transaction_type,
                    bank_transaction.payment_accepted,
                    bank_transaction.amount,
                    CASE 
                        WHEN bank_transaction.path_image != '' THEN
                            CONCAT('`+ Url_Img +`', bank_transaction.path_image) 
                        ELSE ''
                    END AS path_image,
                    bank_transaction.approval_by,
                    bank_transaction.created_by,
                    bank_transaction.modified_by,
                    bank_transaction.posted_by,
                    CONVERT(DATE_FORMAT(bank_transaction.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(bank_transaction.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(bank_transaction.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(bank_transaction.date_posted, "%d-%m-%Y"), CHAR(20)) AS date_posted,
                    CONVERT(DATE_FORMAT(bank_transaction.date_receipt, "%d-%m-%Y"), CHAR(20)) AS date_receipt,
                    CONVERT(DATE_FORMAT(bank_transaction.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(bank_transaction.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
                    bank_transaction.status_receipt,
                    bank_transaction.status_escrow_accepted,
                    bank_transaction.approval_status,
                    bank_transaction.post_status,
                    bank_transaction.status
                FROM
                    bank_transaction
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
}