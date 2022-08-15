var middleware 	= require('nox');
var db 	        = require('nox-db');

var _Data = {
	Status	: 1000
};

module.exports = {
	Read:function(res, Data ) {
		if (Data.Route === 'DEFAULT') {
			var Arr 	= {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'workgroup_id',
					'Value' : Data.tableColumn.workgroup_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param 	= middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					workgroup
				WHERE
					1=1 ` + Param
				).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX') {
			var Arr 	= {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'workgroup_id',
					'Value' : Data.tableColumn.workgroup_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param 	= middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					workgroup
				WHERE
					1=1 ` + Param
				).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else {
			_Data.Status	= 3003;
			middleware.Response(res, _Data);
		}
	}
};