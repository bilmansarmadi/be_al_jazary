var middleware = require('../../assets/nox');
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
					'Field' : 'rprivilege_id',
					'Value' : Data.tableColumn.rprivilege_id.value,
					'Syntax': '='
				}]              
			}; 
			
			var Param 	= middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_rprivilege
					inner join m_role_user on m_role_user.role_id = m_rprivilege.role_id
					inner join m_menu on m_menu.menu_id = m_rprivilege.menu_id
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

