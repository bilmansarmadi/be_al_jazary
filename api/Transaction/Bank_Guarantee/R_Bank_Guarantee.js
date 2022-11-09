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
					bank_guarantee.workgroup_id,
					bank_guarantee.project_id,
					bank_guarantee.bank_code,
					bank_guarantee.account_number,
					bank_guarantee.guarantee_address,
					bank_guarantee.guarantee_permission,
					bank_guarantee.guarantee_type,
					CONVERT(DATE_FORMAT(bank_guarantee.guarantee_date, "%d-%m-%Y"), CHAR(20)) AS guarantee_date,
					bank_guarantee.total_amount,
					bank_guarantee.total_paid,
					bank_guarantee.total_received,
					CONVERT(DATE_FORMAT(bank_guarantee.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
					CONVERT(DATE_FORMAT(bank_guarantee.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
					bank_guarantee.created_by,
					bank_guarantee.modified_by,
					CONVERT(DATE_FORMAT(bank_guarantee.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
					CONVERT(DATE_FORMAT(bank_guarantee.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
					bank_guarantee.status_cashing,
					bank_guarantee.upload_status,
					bank_guarantee.status,
					workgroup.workgroup_name,
					project.project_name,
					bank.bank_name,
					bank_guarantee.date_end <= NOW() + INTERVAL 10 DAY AS show_notification
				FROM
					bank_guarantee
				INNER JOIN
					project ON project.project_id = bank_guarantee.project_id
				INNER JOIN
					workgroup ON workgroup.workgroup_id = bank_guarantee.workgroup_id
				INNER JOIN
					bank ON bank.bank_code = bank_guarantee.bank_code
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
		} else if (Data.Route === 'NOTIFICATION_BANK_GUARANTEE') {
			var Arr = {
				'Data': [
					{
						'Table' : Data.TableName,
						'Field' : 'guarantee_id',
						'Value' : Data.tableColumn.guarantee_id.value,
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
					bank_guarantee.guarantee_id,
					bank_guarantee.workgroup_id,
					bank_guarantee.project_id,
					bank_guarantee.bank_code,
					bank_guarantee.account_number,
					bank_guarantee.guarantee_address,
					bank_guarantee.guarantee_permission,
					bank_guarantee.guarantee_type,
					CONVERT(DATE_FORMAT(bank_guarantee.guarantee_date, "%d-%m-%Y"), CHAR(20)) AS guarantee_date,
					bank_guarantee.total_amount,
					bank_guarantee.total_paid,
					bank_guarantee.total_received,
					CONVERT(DATE_FORMAT(bank_guarantee.date_published, "%d-%m-%Y"), CHAR(20)) AS date_published,
					CONVERT(DATE_FORMAT(bank_guarantee.date_end, "%d-%m-%Y"), CHAR(20)) AS date_end,
					bank_guarantee.created_by,
					bank_guarantee.modified_by,
					CONVERT(DATE_FORMAT(bank_guarantee.date_created, "%d-%m-%Y"), CHAR(20)) AS date_created,
					CONVERT(DATE_FORMAT(bank_guarantee.date_modified, "%d-%m-%Y"), CHAR(20)) AS date_modified,
					bank_guarantee.status_cashing,
					bank_guarantee.upload_status,
					bank_guarantee.status,
					workgroup.workgroup_name,
					project.project_name,
					bank.bank_name,
					bank_guarantee.date_end <= NOW() + INTERVAL 10 DAY AS show_notification
				FROM
					bank_guarantee
				INNER JOIN
					project ON project.project_id = bank_guarantee.project_id
				INNER JOIN
					workgroup ON workgroup.workgroup_id = bank_guarantee.workgroup_id
				INNER JOIN
					bank ON bank.bank_code = bank_guarantee.bank_code
				WHERE
					1=1 AND bank_guarantee.date_end <= NOW() + INTERVAL 10 DAY ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else {
			_Data.Status = 3003;
			middleware.Response(res, _Data);
		}
	}
};