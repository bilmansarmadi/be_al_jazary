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
		if (Data.Route === 'DEFAULT') {
			var Config = Setup.Load_Config();
            var Url_Img = Config.Url_Img + '/Upload/';
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'nilai_id',
					'Value' : Data.tableColumn.nilai_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					nilai_id
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_RIWAYAT_NILAI') {
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
			
			if(Data.tableColumn.nama_kelas.value != ''){
				var nama_kelas = "%"+Data.tableColumn.nama_kelas.value+"%";
				}else{
				var nama_kelas = Data.tableColumn.nama_kelas.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'nilai_id',
					'Value' : Data.tableColumn.nilai_id.value,
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
					'Table' : 'm_mapel',
					'Field' : 'mapel_id',
					'Value' : Data.tableColumn.mapel_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tipe_nilai',
					'Value' : Data.tableColumn.tipe_nilai.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_santri',
					'Field' : 'kode_santri',
					'Value' : value_kode,
					'Syntax': 'LIKE'
				},
				{
					'Table' : 'm_kelas',
					'Field' : 'nama_kelas',
					'Value' : nama_kelas,
					'Syntax': 'LIKE'
				}
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					r_nilai.*,
					DATE_FORMAT(r_nilai.tanggal_nilai, "%d-%m-%Y") AS tanggal_nilai,
					m_kelas.*,
					m_santri.nama_lengkap_santri,
					kode_santri,
					kode_mapel,
					mapel_nama
					FROM
					r_nilai
					INNER JOIN
					k_kelas on k_kelas.kelompok_id = r_nilai.kelompok_id
					INNER JOIN
					m_pengajaran ON m_pengajaran.jadwal_id = k_kelas.jadwal_id
					INNER JOIN
					m_kelas on m_kelas.kelas_id = m_pengajaran.kelas_id
					INNER JOIN
					m_mapel ON m_mapel.mapel_id = m_pengajaran.mapel_id
					INNER JOIN
					m_santri ON m_santri.santri_id = k_kelas.santri_id
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