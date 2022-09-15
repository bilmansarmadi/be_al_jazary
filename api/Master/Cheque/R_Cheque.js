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
                'Data': [{
                    'Table' : Data.TableName,
                    'Field' : 'cheque_number',
                    'Value' : Data.tableColumn.cheque_number.value,
                    'Syntax': '='
                }]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    cheque.cheque_number,
                    cheque.bank_code,
                    cheque.account_number,
                    CONVERT(DATE_FORMAT(cheque.date, "%d-%m-%Y"), CHAR(20)) AS date,
                    cheque.amount,
					bank.bank_name,
					bank_account.account_name
				FROM
					cheque
				INNER JOIN
					bank ON bank.bank_code = cheque.bank_code
				INNER JOIN
                    bank_account ON bank_account.account_number = cheque.account_number
				WHERE
					1=1 ` + Param
            ).then((feedbank) => {
                middleware.Response(res, feedbank);
            });
        } else if (Data.Route === 'COMBOBOX') {
            var Arr = {
                'Data': [{
                    'Table' : Data.TableName,
                    'Field' : 'cheque_number',
                    'Value' : Data.tableColumn.cheque_number.value,
                    'Syntax': '='
                }]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    *
				FROM
					cheque
				WHERE
					1=1 ` + Param
            ).then((feedbank) => {
                middleware.Response(res, feedbank);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};