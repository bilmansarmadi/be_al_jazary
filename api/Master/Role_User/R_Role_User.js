var middleware 	= require('nox');
var db 	        = require('nox-db');
var md5			= require('md5');

var _Data = {
	Status	: 1000
};

module.exports = {
	Read:function(res, Data ) {
		if (Data.Route === 'DEFAULT') {
			var Arr 	= {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'role_id',
					'Value' : Data.tableColumn.role_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'role_nama',
					'Value' : "%"+Data.tableColumn.role_nama.value+"%",
					'Syntax': 'LIKE'
				}]
               
			}; 
			
			var Param 	= middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_role_user
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		}else {
			_Data.Status	= 3003;
			middleware.Response(res, _Data);
		}
	}
};

