var middleware 	= require('nox');
var db 	        = require('nox-db');

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
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'account_number',
					'Value' : Data.tableColumn.account_number.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*,
					bank.bank_name,
					currency.currency_name,
					workgroup.workgroup_name
				FROM
					bank_account
				INNER JOIN
					bank ON bank.bank_code = bank_account.bank_code
				INNER JOIN
					currency ON currency.currency_id = bank_account.currency_id
				INNER JOIN
					workgroup ON workgroup.workgroup_id = bank_account.workgroup_id
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX') {
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'account_number',
					'Value' : Data.tableColumn.account_number.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*,
					bank.bank_name,
					currency.currency_name,
					workgroup.workgroup_name
				FROM
					bank_account
				INNER JOIN
					bank ON bank.bank_code = bank_account.bank_code
				INNER JOIN
					currency ON currency.currency_id = bank_account.currency_id
				INNER JOIN
					workgroup ON workgroup.workgroup_id = bank_account.workgroup_id
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