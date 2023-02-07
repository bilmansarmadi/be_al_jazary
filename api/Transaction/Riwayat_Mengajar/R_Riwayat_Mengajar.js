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
					'Field' : 'r_mengajar_id',
					'Value' : Data.tableColumn.r_mengajar_id.value,
					'Syntax': '='
				}]                
			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT 
					*
				FROM
					r_mengajar
				WHERE
					1=1 ` + Param
			).then((feedback) => {
				middleware.Response(res, feedback);
			});
		} else if (Data.Route === 'READ_RIWAYAT_MENGAJAR') {
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

			if(Data.tableColumn.alamat_riwayat.value != ''){
				var alamat = "%"+Data.tableColumn.alamat_riwayat.value+"%";
				}else{
				var alamat = Data.tableColumn.alamat_riwayat.value;
			}

			var Arr = {
				'Data': [{
					'Table' : Data.TableName,
					'Field' : 'r_mengajar_id',
					'Value' : Data.tableColumn.r_mengajar_id.value,
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
					'Field' : 'dari_tahun',
					'Value' : Data.tableColumn.dari_tahun.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'sampai_tahun',
					'Value' : Data.tableColumn.sampai_tahun.value,
					'Syntax': '='
				},
				{
					'Table' : Data.TableName,
					'Field' : 'alamat_riwayat',
					'Value' : alamat,
					'Syntax': 'LIKE'
				},
				{
					'Table' : 'm_pengajar',
					'Field' : 'nip',
					'Value' : value_kode,
					'Syntax': 'LIKE'
				}
				]
				

			}; 
			
			var Param = middleware.AdvSqlParamGenerator(Arr);
			
			db.Read(
				`SELECT
					r_mengajar_id,
					dari_tahun,
					sampai_tahun,
					nama_sekolah,
					keterangan_riwayat,
					nip,
					nama_lengkap,
					alamat_riwayat
					FROM
					r_mengajar
					INNER JOIN
					m_pengajar on m_pengajar.pengajar_id = r_mengajar.pengajar_id
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