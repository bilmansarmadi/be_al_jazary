var middleware  = require('nox');
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
		if (Data.Route === 'DEFAULT') {
			var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/Upload/';
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'pengajar_id',
					'Value' : Data.tableColumn.pengajar_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_pengajar
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'Read_Pengajar') {
			var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/';
			
			if(Data.tableColumn.nama_lengkap.value != ''){
				var value = "%"+Data.tableColumn.nama_lengkap.value+"%";
				}else{
				var value = Data.tableColumn.nama_lengkap.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'nip',
					'Value' : Data.tableColumn.nip.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'nama_lengkap',
					'Value' :  value,
					'Syntax': 'LIKE'
				}]                 
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
				pengajar_id,
				nip,
				nama_lengkap,
				panggilan,
				DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") AS tanggal_lahir,
				alamat,
				berat_badan,
				tinggi_badan,
				email,
				hafalan_mutqin,
				status_nikah,
				CASE WHEN jenis_kelamin = 'L' THEN 'Ikhwan' ELSE 'Akhwat' END jenis_kelamin,
				CASE
				WHEN foto != '.' THEN CONCAT('`+ Url_Img +`', foto)
				ELSE ''
			    END AS foto
				FROM
					m_pengajar
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_DETAIL_MENU') {
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'pengajar_id',
					'Value' : Data.tableColumn.pengajar_id.value,
					'Syntax': '='
				}],
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'menu_nama',
					'Value' : "%"+Data.tableColumn.menu_nama.value+"%",
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