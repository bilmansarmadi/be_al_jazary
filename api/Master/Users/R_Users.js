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
					'Field' : 'user_id',
					'Value' : Data.tableColumn.user_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param 	= middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_user
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route == 'LOGIN') {
			if (DataValidation(Data)) {
				var Arr = {
					user_email: Data.tableColumn.user_email.value,
					user_password: md5(Data.tableColumn.user_password.value)
				};

				var Param = middleware.SqlParamGenerator(Arr);

				db.Read(
					`SELECT
						*		
						FROM
						m_user
					WHERE
						1=1` + Param
				).then((feedback) => {
					middleware.Response(res, feedback);
				});
			} else {
				_Data.Status	= 3005;
				middleware.Response(res, _Data);
			}
		} else {
			_Data.Status	= 3003;
			middleware.Response(res, _Data);
		}
	}
};

function DataValidation(Data) {
	var Result = true;

	if (Data.Route == 'LOGIN') {
		var ColumnArr = [
			'user_email',
			'user_password'
		];

		Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
	}

	return Result;
}