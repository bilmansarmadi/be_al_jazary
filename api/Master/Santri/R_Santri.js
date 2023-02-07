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
					'Field' : 'santri_id',
					'Value' : Data.tableColumn.santri_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					m_santri
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'Read_Santri') {
			var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/';
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'kode_santri',
					'Value' : Data.tableColumn.kode_santri.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'nama_lengkap_santri',
					'Value' :  Data.tableColumn.nama_lengkap_santri.value,
					'Syntax': 'LIKE'
				}]               
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
				santri_id,
				kode_santri,
				nama_lengkap_santri,
				panggilan,
				DATE_FORMAT(tanggal_lahir, "%d-%m-%Y") AS tanggal_lahir,
				tempat_lahir,
				anak_ke,
				alamat,
				berat_badan,
				tinggi_badan,
				email,
				hafalan_mutqin,
				hafalan_ziyadah,
				nama_ayah,
				nama_ibu,
				hp_ortu,
				CASE
				WHEN foto != '.' THEN CONCAT('`+ Url_Img +`', foto)
				ELSE ''
			    END AS foto
				FROM
					m_santri
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