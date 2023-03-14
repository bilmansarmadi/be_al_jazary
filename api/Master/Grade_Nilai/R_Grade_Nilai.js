var middleware 	= require('../../../assets/nox');
var db 	        = require('../../../assets/nox-db');

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
					'Field' : 'grade_id',
					'Value' : Data.tableColumn.grade_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_grade_nilai
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_GRADE_NILAI') {
			
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'grade_id',
					'Value' : Data.tableColumn.grade_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'grade',
					'Value' : Data.tableColumn.grade.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'predikat',
					'Value' : Data.tableColumn.predikat.value,
					'Syntax': '='
				}]             
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_grade_nilai
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