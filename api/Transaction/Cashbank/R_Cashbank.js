var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
    Read:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_id',
                        'Value' : Data.tableColumn.cashbank_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_type',
                        'Value' : Data.tableColumn.cashbank_type.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_permission',
                        'Value' : Data.tableColumn.cashbank_permission.value,
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
                    cashbank.cashbank_id,
                    cashbank.no_voucher,
                    cashbank.workgroup_id,
                    cashbank.project_id,
                    cashbank.guarantee_id,
                    cashbank.period_code,
                    cashbank.cashbank_desc,
                    CONVERT(DATE_FORMAT(cashbank.cashbank_date, "%d-%m-%Y"), CHAR(20)) AS cashbank_date,
                    cashbank.cashbank_type,
                    cashbank.cashbank_permission,
                    cashbank.transaction_type,
                    cashbank.reference,
                    cashbank.account_number,
                    cashbank.amount,
                    cashbank.created_by,
                    cashbank.modified_by,
                    cashbank.posted_by,
                    CONVERT(DATE_FORMAT(cashbank.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
                    CONVERT(DATE_FORMAT(cashbank.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
                    CONVERT(DATE_FORMAT(cashbank.date_posted, "%d-%m-%Y"), CHAR(20)) AS date_posted,
                    cashbank.post_status,
                    cashbank.status,
                    workgroup.workgroup_name,
                    project.project_name
                FROM
                    cashbank
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = cashbank.workgroup_id
                INNER JOIN
                    project ON project.project_id = cashbank.project_id
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'DETAIL') {
            var Arr = {
                'Data': [{
                    'Table' : 'cashbank_detail',
                    'Field' : 'cashbank_id',
                    'Value' : Data.tableColumn.cashbank_id.value,
                    'Syntax': '='
                }]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    *,
                    project.project_name
                FROM
                    cashbank_detail
                INNER JOIN
                    project ON project.project_id = cashbank_detail.project_id
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'LAST_TRANSFER_DEFAULT_DETAIL') {
            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_id',
                        'Value' : Data.tableColumn.cashbank_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_type',
                        'Value' : getCashbankType(Data.tableColumn.cashbank_type.value),
                        'Syntax': 'IN'
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_date',
                        'Value' : Data.tableColumn.cashbank_date.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    cashbank.cashbank_id,
                    cashbank.period_code,
                    cashbank.cashbank_desc,
                    CONVERT(DATE_FORMAT(cashbank.cashbank_date, "%d-%m-%Y"), CHAR(20)) AS cashbank_date,
                    cashbank.cashbank_type,
                    cashbank.reference,
                    cashbank.no_voucher,
                    cashbank.account_number,
                    cashbank.created_by,
                    cashbank.modified_by,
                    cashbank.posted_by,
                    cashbank.date_created,
                    cashbank.date_modified,
                    cashbank.date_posted,
                    cashbank.post_status,
                    cashbank.status,
                    cashbank_detail.amount
                FROM
                    cashbank
                INNER JOIN
                    cashbank_detail ON cashbank_detail.cashbank_id = cashbank.cashbank_id
                WHERE
                    1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'CASHBANK_DEFAULT_DETAIL') {
            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_id',
                        'Value' : Data.tableColumn.cashbank_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_type',
                        'Value' : getCashbankType(Data.tableColumn.cashbank_type.value),
                        'Syntax': 'IN'
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            qry_where = (Data.tableColumn.daily_monthly.value === "D") ? `AND cashbank.cashbank_date = '`+ Data.tableColumn.cashbank_date.value +`'` : `AND CONVERT(DATE_FORMAT(cashbank.cashbank_date, '%m'), CHAR(20)) = CONVERT(DATE_FORMAT('`+ Data.tableColumn.cashbank_date.value +`', '%m'), CHAR(20))`;

            db.Read(
                `SELECT
                    cashbank.cashbank_id,
                    cashbank.period_code,
                    cashbank.cashbank_desc,
                    CONVERT(DATE_FORMAT(cashbank.cashbank_date, "%d-%m-%Y"), CHAR(20)) AS cashbank_date,
                    cashbank.cashbank_type,
                    cashbank.reference,
                    cashbank.no_voucher,
                    cashbank.account_number,
                    cashbank.created_by,
                    cashbank.modified_by,
                    cashbank.posted_by,
                    cashbank.date_created,
                    cashbank.date_modified,
                    cashbank.date_posted,
                    cashbank.post_status,
                    cashbank.status,
                    cashbank_detail.amount
                FROM
                    cashbank
                INNER JOIN
                    cashbank_detail ON cashbank_detail.cashbank_id = cashbank.cashbank_id
                WHERE
                    1=1 ` + qry_where + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }

        function getCashbankType(cashbank_type) {
            let Value = null;

            if (cashbank_type == 'T') {
                Value = "'TI', 'TE'";
            } else if (cashbank_type == 'K') {
                Value = "'I', 'E'";
            }

            return Value;
        }
    }
};