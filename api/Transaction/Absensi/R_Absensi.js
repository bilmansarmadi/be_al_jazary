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
					'Field' : 'absensi_id',
					'Value' : Data.tableColumn.absensi_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					r_absensi
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_ABSENSI') {
			if(Data.tableColumn.nama_lengkap_santri.value != ''){
				var values = "%"+Data.tableColumn.nama_lengkap_santri.value+"%";
				}else{
				var values = Data.tableColumn.nama_lengkap_santri.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'absensi_id',
					'Value' : Data.tableColumn.absensi_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_santri',
					'Field' : 'nama_lengkap_santri',
					'Value' :  values,
					'Syntax': 'LIKE'
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tanggal_absensi',
					'Value' : Data.tableColumn.tanggal_absensi.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_mapel',
					'Field' : 'mapel_id',
					'Value' : Data.tableColumn.mapel_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_tahun_ajaran',
					'Field' : 'tahun_id',
					'Value' : Data.tableColumn.tahun_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_kelas',
					'Field' : 'kelas_id',
					'Value' : Data.tableColumn.kelas_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_pengajar',
					'Field' : 'pengajar_id',
					'Value' : Data.tableColumn.pengajar_id.value,
					'Syntax': '='
				}
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					r_absensi.absensi_id,
					r_absensi.jadwal_id,
					r_absensi.santri_id,
					CASE
					WHEN r_absensi.status_kehadiran = 1 THEN 'Hadir'
					WHEN r_absensi.status_kehadiran = 2 THEN 'Tidak Hadir'
					WHEN r_absensi.status_kehadiran = 3 THEN 'Ijin'
					WHEN r_absensi.status_kehadiran = 4 THEN 'Sakit'
					END AS status_Kehadiran,
					r_absensi.keterangan_absensi,
					m_santri.kode_santri,
					m_santri.nama_lengkap_santri,
					m_kelas.nama_kelas,
					m_pengajar.nip AS nip_pengajar,
					m_pengajar.nama_lengkap AS nama_pengajar,
					m_tahun_ajaran.tahun_ajaran,
					CASE 
					WHEN m_tahun_ajaran.tipe_ajaran = 1 THEN 'Genap'
					WHEN m_tahun_ajaran.tipe_ajaran = 2 THEN 'Ganjil'
					END AS semester,
					m_mapel.mapel_nama,
					CONCAT(m_pengajaran.jam_mulai, '-', m_pengajaran.jam_akhir) AS jam_belajar,
					DATE_FORMAT(r_absensi.tanggal_absensi, "%d-%m-%Y") AS tanggal_absensi,
					m_pengajaran.hari
					FROM
					r_absensi
					INNER JOIN
					m_pengajaran ON m_pengajaran.jadwal_id = r_absensi.jadwal_id
					INNER JOIN
					m_santri ON m_santri.santri_id = r_absensi.santri_id
					INNER JOIN
					m_kelas ON m_kelas.kelas_id = m_pengajaran.kelas_id
					INNER JOIN	
					m_mapel ON m_mapel.mapel_id = m_pengajaran.mapel_id
					INNER JOIN
					m_pengajar ON m_pengajar.pengajar_id = m_pengajaran.pengajar_id
					INNER JOIN
					m_tahun_ajaran ON m_tahun_ajaran.tahun_id = m_pengajaran.tahun_id
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