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
					'Field' : 'mapel_id',
					'Value' : Data.tableColumn.mapel_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_mapel
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_MAPEL') {

			if(Data.tableColumn.mapel_nama.value != ''){
				var values = "%"+Data.tableColumn.mapel_nama.value+"%";
				}else{
				var values = Data.tableColumn.mapel_nama.value;
			}
			
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'mapel_id',
					'Value' : Data.tableColumn.mapel_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kategori_id',
					'Value' : Data.tableColumn.kategori_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'status_mapel',
					'Value' : Data.tableColumn.status_mapel.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kode_mapel',
					'Value' : Data.tableColumn.kode_mapel.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'mapel_nama',
					'Value' : values,
					'Syntax': 'LIKE'
				}]                 
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_mapel
					inner join
					m_kategori_kurikulum on m_kategori_kurikulum.kategori_id = m_mapel.kategori_id
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