var middleware 	= require('nox');;
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
					'Field' : 'tahun_id',
					'Value' : Data.tableColumn.tahun_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_tahun_ajaran
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_TAHUN_AJARAN') {
			
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'tahun_id',
					'Value' : Data.tableColumn.tahun_id.value,
					'Syntax': '='
				},{
					'Table' : Data.TableName,
					'Field' : 'tipe_ajaran',
					'Value' : Data.tableColumn.tipe_ajaran.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tahun_ajaran',
					'Value' : Data.tableColumn.tahun_ajaran.value,
					'Syntax': '='
				}
				]             
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_tahun_ajaran
				WHERE
					1=1` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		}else{
			_Data.Status = 3003;
			middleware.Response(res, _Data);
		}
	}
};