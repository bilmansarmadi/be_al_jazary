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
					'Field' : 'kelompok_id',
					'Value' : Data.tableColumn.kelompok_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					kelompok_id
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_KELOMPOK_KELAS') {
			if(Data.tableColumn.nama_lengkap_santri.value != ''){
				var values = "%"+Data.tableColumn.nama_lengkap_santri.value+"%";
				}else{
				var values = Data.tableColumn.nama_lengkap_santri.value;
			}

			if(Data.tableColumn.kode_santri.value != ''){
				var value_kode = "%"+Data.tableColumn.kode_santri.value+"%";
				}else{
				var value_kode = Data.tableColumn.kode_santri.value;
			}

			if(Data.tableColumn.mapel_nama.value != ''){
				var mapel_nama = "%"+Data.tableColumn.mapel_nama.value+"%";
				}else{
				var mapel_nama = Data.tableColumn.mapel_nama.value;
			}

			if(Data.tableColumn.kode_mapel.value != ''){
				var kode_mapel = "%"+Data.tableColumn.kode_mapel.value+"%";
				}else{
				var kode_mapel = Data.tableColumn.kode_mapel.value;
			}


			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'kelompok_id',
					'Value' : Data.tableColumn.kelompok_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_santri',
					'Field' : 'nama_lengkap_santri',
					'Value' :  values,
					'Syntax': 'LIKE'
				},
				{
					'Table' : 'm_mapel',
					'Field' : 'mapel_nama',
					'Value' :  mapel_nama,
					'Syntax': 'LIKE'
				},
				{
					'Table' : 'm_mapel',
					'Field' : 'kode_mapel',
					'Value' :  kode_mapel,
					'Syntax': 'LIKE'
				},
				{
					'Table' : 'm_santri',
					'Field' : 'kode_santri',
					'Value' : value_kode,
					'Syntax': 'LIKE'
				}
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					k_kelas.*,
					m_santri.nama_lengkap_santri,
					kode_santri,
					kode_mapel,
					mapel_nama
					FROM
					k_kelas
					INNER JOIN
					m_pengajaran on m_pengajaran.jadwal_id = k_kelas.jadwal_id
					INNER JOIN
					m_santri on m_santri.santri_id = k_kelas.santri_id
					INNER JOIN
					m_mapel on m_mapel.mapel_id = m_pengajaran.mapel_id
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