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
					'Field' : 'kelas_id',
					'Value' : Data.tableColumn.kelas_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_kelas
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_KELAS') {

			if(Data.tableColumn.nama_kelas.value != ''){
				var values = "%"+Data.tableColumn.nama_kelas.value+"%";
				}else{
				var values = Data.tableColumn.nama_kelas.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'kelas_id',
					'Value' : Data.tableColumn.kelas_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'status_kelas',
					'Value' : Data.tableColumn.status_kelas.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'nama_kelas',
					'Value' : values,
					'Syntax': 'LIKE'
				}]
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_kelas
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