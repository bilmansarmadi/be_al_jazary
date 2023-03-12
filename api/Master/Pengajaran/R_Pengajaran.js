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
					'Field' : 'jadwal_id',
					'Value' : Data.tableColumn.jadwal_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
				m_pengajaran
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'COMBOBOX_PENGAJARAN') {			
			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'jadwal_id',
					'Value' : Data.tableColumn.jadwal_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'mapel_id',
					'Value' : Data.tableColumn.mapel_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'kelas_id',
					'Value' : Data.tableColumn.kelas_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tahun_id',
					'Value' : Data.tableColumn.tahun_id.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'pengajar_id',
					'Value' : Data.tableColumn.pengajar_id.value,
					'Syntax': '='
				}
				]                
			};  
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
				m_pengajaran.jadwal_id,
				jam_mulai,
				jam_akhir,
				hari,
				m_pengajaran.mapel_id,
				mapel_nama,
				m_pengajaran.kelas_id,
				nama_kelas,
				m_pengajaran.pengajar_id,
				nama_lengkap as nama_pengajar,
				m_tahun_ajaran.tahun_id,
				tahun_ajaran,
				case
				when tipe_ajaran = 1 then 'genap'
				when tipe_ajaran = 2 then 'ganjil'
				else '-' end as semester
				FROM
					m_pengajaran
					inner join
					m_pengajar ON m_pengajar.pengajar_id = m_pengajaran.pengajar_id
					inner join
					m_kelas on m_kelas.kelas_id = m_pengajaran.kelas_id
					inner join 
					m_mapel on m_mapel.mapel_id = m_pengajaran.mapel_id
					inner join
					m_tahun_ajaran on m_tahun_ajaran.tahun_id = m_pengajaran.tahun_id
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