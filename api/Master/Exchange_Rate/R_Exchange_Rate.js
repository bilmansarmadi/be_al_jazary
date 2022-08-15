var middleware 	= require('nox');
var db 	        = require('nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
	Read:function(res, Data ) {
		if (Data.Route === 'DEFAULT') {
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'rate_id',
					'Value' : Data.tableColumn.rate_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					exchange_rate.rate_id,
					exchange_rate.currency_id,
					CONVERT(DATE_FORMAT(exchange_rate.rate_date, "%d-%m-%Y"), CHAR(20)) AS rate_date,
					exchange_rate.rate_amount,
					currency.currency_name
				FROM
					exchange_rate
				INNER JOIN
					currency ON currency.currency_id = exchange_rate.currency_id
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