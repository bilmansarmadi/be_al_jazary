var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Read:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            var Arr = {
                'Data' : [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_type',
                        'Value' : Data.tableColumn.submission_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_permission',
                        'Value' : Data.tableColumn.submission_permission.value,
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
                    submission_form.submission_number,
                    submission_form.workgroup_id,
                    submission_form.organizational_unit_id,
                    submission_form.work_unit_id,
                    submission_form.project_id,
                    submission_form.bank_code,
                    submission_form.account_number,
                    CONVERT(DATE_FORMAT(submission_form.date_submission, "%d-%m-%Y"), CHAR(20)) AS date_submission,
                    submission_form.submission_desc,
                    submission_form.submission_type,
                    submission_form.submission_permission,
                    submission_form.submission_financing,
                    submission_form.transaction_type,
                    submission_form.amount,
                    submission_form.checking_by,
                    submission_form.approval_by,
                    submission_form.created_by,
                    submission_form.modified_by,
                    CONVERT(DATE_FORMAT(submission_form.date_checking, "%d-%m-%Y"), CHAR(20)) AS date_checking,
                    CONVERT(DATE_FORMAT(submission_form.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(submission_form.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(submission_form.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(submission_form.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(submission_form.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
                    submission_form.checking_status,
                    submission_form.approval_status,
                    submission_form.allocation_status,
                    submission_form.status_cashing,
                    submission_form.status,
                    workgroup.workgroup_name,
                    organizational_units.organizational_unit_name,
                    work_units.work_unit_name,
                    project.project_name,
                    bank.bank_name,
                    submission_form.date_end <= NOW() + INTERVAL 10 DAY AS show_notification
                FROM
                    submission_form
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = submission_form.workgroup_id
                INNER JOIN
                    organizational_units ON organizational_units.organizational_unit_id = submission_form.organizational_unit_id
                INNER JOIN
                    work_units ON work_units.work_unit_id = submission_form.work_unit_id
                INNER JOIN
                    project ON project.project_id = submission_form.project_id
                LEFT JOIN
                    bank ON bank.bank_code = submission_form.bank_code
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'DEFAULT_BANK_GUARANTEE') {
            var Arr = {
                'Data' : [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_type',
                        'Value' : Data.tableColumn.submission_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_permission',
                        'Value' : Data.tableColumn.submission_permission.value,
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
                    submission_form.submission_number,
                    submission_form.workgroup_id,
                    submission_form.organizational_unit_id,
                    submission_form.work_unit_id,
                    submission_form.project_id,
                    submission_form.bank_code,
                    submission_form.account_number,
                    CONVERT(DATE_FORMAT(submission_form.date_submission, "%d-%m-%Y"), CHAR(20)) AS date_submission,
                    submission_form.submission_desc,
                    submission_form.submission_type,
                    submission_form.submission_permission,
                    submission_form.submission_financing,
                    submission_form.transaction_type,
                    submission_form.amount,
                    submission_form.checking_by,
                    submission_form.approval_by,
                    submission_form.created_by,
                    submission_form.modified_by,
                    CONVERT(DATE_FORMAT(submission_form.date_checking, "%d-%m-%Y"), CHAR(20)) AS date_checking,
                    CONVERT(DATE_FORMAT(submission_form.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(submission_form.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(submission_form.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(submission_form.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(submission_form.date_end, "%d-%m-%Y"),CHAR(20)) AS date_end,
                    submission_form.checking_status,
                    submission_form.approval_status,
                    submission_form.allocation_status,
                    submission_form.status_cashing,
                    submission_form.status,
                    workgroup.workgroup_name,
                    project.project_name,
                    bank.bank_name,
                    submission_form.date_end <= NOW() + INTERVAL 10 DAY AS show_notification
                FROM
                    submission_form
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = submission_form.workgroup_id
                INNER JOIN
                    project ON project.project_id = submission_form.project_id
                LEFT JOIN
                    bank ON bank.bank_code = submission_form.bank_code
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'NOTIFICATION_FOR_BANK_GUARANTEE') {
            var Arr = {
                'Data' : [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_type',
                        'Value' : Data.tableColumn.submission_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_permission',
                        'Value' : Data.tableColumn.submission_permission.value,
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
						'Field' : 'status_cashing',
						'Value' : Data.tableColumn.status_cashing.value,
						'Syntax': '='
					}
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    submission_form.submission_number,
                    submission_form.workgroup_id,
                    submission_form.organizational_unit_id,
                    submission_form.work_unit_id,
                    submission_form.project_id,
                    submission_form.bank_code,
                    submission_form.account_number,
                    CONVERT(DATE_FORMAT(submission_form.date_submission, "%d-%m-%Y"), CHAR(20)) AS date_submission,
                    submission_form.submission_desc,
                    submission_form.submission_type,
                    submission_form.submission_permission,
                    submission_form.submission_financing,
                    submission_form.transaction_type,
                    submission_form.amount,
                    submission_form.checking_by,
                    submission_form.approval_by,
                    submission_form.created_by,
                    submission_form.modified_by,
                    CONVERT(DATE_FORMAT(submission_form.date_checking, "%d-%m-%Y"), CHAR(20)) AS date_checking,
                    CONVERT(DATE_FORMAT(submission_form.date_approval, "%d-%m-%Y"), CHAR(20)) AS date_approval,
                    CONVERT(DATE_FORMAT(submission_form.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(submission_form.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(submission_form.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
                    CONVERT(DATE_FORMAT(submission_form.date_end, "%d-%m-%Y"),CHAR(20)) AS date_end,
                    submission_form.checking_status,
                    submission_form.approval_status,
                    submission_form.allocation_status,
                    submission_form.status_cashing,
                    submission_form.status,
                    workgroup.workgroup_name,
                    project.project_name,
                    bank.bank_name,
                    submission_form.date_end <= NOW() + INTERVAL 10 DAY AS show_notification
                FROM
                    submission_form
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = submission_form.workgroup_id
                INNER JOIN
                    project ON project.project_id = submission_form.project_id
                LEFT JOIN
                    bank ON bank.bank_code = submission_form.bank_code
                WHERE
                    1=1 AND submission_form.date_end <= NOW() + INTERVAL 10 DAY ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};