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
					'Field' : 'guarantee_id',
					'Value' : Data.tableColumn.guarantee_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					bank_guarantee.guarantee_id,
					bank_guarantee.project_id,
					bank_guarantee.guarantee_address,
					bank_guarantee.account_number,
					bank_guarantee.total_amount,
					bank_guarantee.total_paid,
					bank_guarantee.total_received,
					CONVERT(DATE_FORMAT(bank_guarantee.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
					CONVERT(DATE_FORMAT(bank_guarantee.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
					bank_guarantee.created_by,
					bank_guarantee.modified_by,
					bank_guarantee.date_created,
					bank_guarantee.date_modified,
					bank_guarantee.status,
					project.project_name
				FROM
					bank_guarantee
				INNER JOIN
					project ON project.project_id = bank_guarantee.project_id
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX') {
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'guarantee_id',
					'Value' : Data.tableColumn.guarantee_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					bank_guarantee
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