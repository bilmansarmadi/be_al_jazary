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
					'Field' : 'r_pendidikan_pengajar_id',
					'Value' : Data.tableColumn.r_pendidikan_pengajar_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					r_pendidikan_pengajar
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_RDIK_PENGAJAR') {
			if(Data.tableColumn.nama_lengkap.value != ''){
				var values = "%"+Data.tableColumn.nama_lengkap.value+"%";
				}else{
				var values = Data.tableColumn.nama_lengkap.value;
			}

			if(Data.tableColumn.nip.value != ''){
				var value_kode = "%"+Data.tableColumn.nip.value+"%";
				}else{
				var value_kode = Data.tableColumn.nip.value;
			}

			if(Data.tableColumn.nama_sekolah.value != ''){
				var value = "%"+Data.tableColumn.nama_sekolah.value+"%";
				}else{
				var value = Data.tableColumn.nama_sekolah.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'r_pendidikan_pengajar_id',
					'Value' : Data.tableColumn.r_pendidikan_pengajar_id.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_pengajar',
					'Field' : 'nama_lengkap',
					'Value' :  values,
					'Syntax': 'LIKE'
				},
				{
					'Table' : Data.TableName,
					'Field' : 'nama_sekolah',
					'Value' :  value,
					'Syntax': 'LIKE'
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tahun_masuk',
					'Value' : Data.tableColumn.tahun_masuk.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tahun_lulus',
					'Value' : Data.tableColumn.tahun_lulus.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'status_sekolah',
					'Value' : Data.tableColumn.status_sekolah.value,
					'Syntax': '='
				},
				{
					'Table' : 'm_pengajar',
					'Field' : 'nip',
					'Value' : value_kode,
					'Syntax': 'LIKE'
				},
				{
					'Table' : Data.TableName,
					'Field' : 'tingkat',
					'Value' : Data.tableColumn.tingkat.value,
					'Syntax': '='
				}
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					r_pendidikan_pengajar_id,
					tahun_masuk,
					tahun_lulus,
					nama_sekolah,
					keterangan_riwayat,
					tingkat,
					case when tingkat = 1 then 'SD Sederajat' when tingkat = 2 then 'SLTP' when tingkat = 3 then 'SLTA' when tingkat = 4 then 'strata 1'
					when tingkat = 5 then 'Strata 1' when tingkat = 6 then 'Strata 2' when tingkat = 7 then 'Strata 3' ELSE '-' end AS tingkat,
					nip,
					nama_lengkap,
					case
					when status_sekolah = 1 THEN 'Negeri'
					ELSE 'Swasta' END AS status_sekolah,
					alamat_riwayat
					FROM
					r_pendidikan_pengajar
					INNER JOIN
					m_pengajar on m_pengajar.pengajar_id = r_pendidikan_pengajar.pengajar_id
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