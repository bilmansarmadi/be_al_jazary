var middleware 	= require('nox');
var db          = require('nox-db');
var Setup       = require('nox-config');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
	Read:function(res, Data ) {
		if (Data.Route === 'DEFAULT') {;
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'kategori_id',
					'Value' : Data.tableColumn.kategori_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_kategori
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_KATEGORI_KURIKULUM') {
			if(Data.tableColumn.kurikulum_nama.value != ''){
				var values = "%"+Data.tableColumn.kurikulum_nama.value+"%";
				}else{
				var values = Data.tableColumn.kurikulum_nama.value;
			}

			if(Data.tableColumn.kategori_nama.value != ''){
				var value = "%"+Data.tableColumn.kategori_nama.value+"%";
				}else{
				var value = Data.tableColumn.kategori_nama.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'kategori_id',
					'Value' : Data.tableColumn.kategori_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kategori_status',
					'Value' : Data.tableColumn.kategori_status.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kurikulum_id',
					'Value' : Data.tableColumn.kurikulum_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kategori_nama',
					'Value' : values,
					'Syntax': '='
				},
				{
					'Table' : 'm_kurikulum',
					'Field' : 'kurikulum_nama',
					'Value' : value,
					'Syntax': 'LIKE'
				},{
					'Table' : 'm_kurikulum',
					'Field' : 'kurikulum_status',
					'Value' : Data.tableColumn.kurikulum_status.value,
					'Syntax': '='
				},
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					*
					FROM
					m_kategori_kurikulum
					inner join
					m_kurikulum on m_kurikulum.kurikulum_id = m_kategori_kurikulum.kurikulum_id
					WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		}else {
			_Data.Status = 3003;
			middleware.Response(res, _Data);
		}
	}
};