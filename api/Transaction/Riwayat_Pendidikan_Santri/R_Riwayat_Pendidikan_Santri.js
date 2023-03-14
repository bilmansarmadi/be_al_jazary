var middleware 	= require('../../../assets/nox');
var db 	        = require('../../../assets/nox-db');
var Setup       = require('../../../assets/nox-config');

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
					'Field' : 'r_pendidikan_id',
					'Value' : Data.tableColumn.r_pendidikan_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					r_pendidikan_santri
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_RDIK_SANTRI') {
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

			if(Data.tableColumn.nama_sekolah.value != ''){
				var value = "%"+Data.tableColumn.nama_sekolah.value+"%";
				}else{
				var value = Data.tableColumn.nama_sekolah.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'r_pendidikan_id',
					'Value' : Data.tableColumn.r_pendidikan_id.value,
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
					'Table' : 'm_santri',
					'Field' : 'kode_santri',
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
					r_pendidikan_id,
					tahun_masuk,
					tahun_lulus,
					nama_sekolah,
					keterangan_riwayat,
					tingkat,
					case when tingkat = 1 then 'SD Sederajat' when tingkat = 2 then 'SLTP' when tingkat = 3 then 'SLTA' when tingkat = 4 then 'strata 1'
					when tingkat = 5 then 'strata 1' when tingkat = 6 then 'strata 2' when tingkat = 7 then 'strata 3' ELSE '-' end AS tingkat,
					kode_santri,
					nama_lengkap_santri,
					case
					when status_sekolah = 1 THEN 'Negeri'
					ELSE 'Swasta' END AS status_sekolah,
					alamat_riwayat
					FROM
					r_pendidikan_santri
					INNER JOIN
					m_santri on m_santri.santri_id = r_pendidikan_santri.santri_id
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