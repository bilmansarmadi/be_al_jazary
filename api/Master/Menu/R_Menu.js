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
					'Field' : 'menu_id',
					'Value' : Data.tableColumn.menu_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_menu
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_HEADERS_MENU') {
			if(Data.tableColumn.menu_nama.value != ''){
				var values = "%"+Data.tableColumn.menu_nama.value+"%";
				}else{
				var values = Data.tableColumn.menu_nama.value;
			}
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'menu_id',
					'Value' : Data.tableColumn.menu_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'menu_nama',
					'Value' : values,
					'Syntax': 'LIKE'
				}]              
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_menu
				WHERE
					1=1 AND parent_id = 0 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_DETAIL_MENU') {
			if(Data.tableColumn.menu_nama.value != ''){
				var values = "%"+Data.tableColumn.menu_nama.value+"%";
				}else{
				var values = Data.tableColumn.menu_nama.value;
			}
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'menu_id',
					'Value' : Data.tableColumn.menu_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'menu_nama',
					'Value' : values,
					'Syntax': 'LIKE'
				}],
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_menu
				WHERE
					1=1 AND parent_id != 0 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else {
			_Data.Status = 3003;
			middleware.Response(res, _Data);
		}
	}
};