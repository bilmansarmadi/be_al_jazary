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
                    cashbank.account_number,
                    cashbank.created_by,
                    cashbank.modified_by,
                    cashbank.posted_by,
                    cashbank.date_created,
                    cashbank.date_modified,
                    cashbank.date_posted,
                    cashbank.status
                FROM
                    cashbank
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
        } else if (Data.Route === 'DEFAULT_DETAIL') {
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
                        'Syntax': (Data.Token === 'R_LAST_TRANSFER') ? '=' : '!='
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
                    cashbank.account_number,
                    cashbank.created_by,
                    cashbank.modified_by,
                    cashbank.posted_by,
                    cashbank.date_created,
                    cashbank.date_modified,
                    cashbank.date_posted,
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
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};