var express     = require('../../../assets/express');
var middleware 	= require('../../../assets/nox');
var multer      = require('../../../assets/multer');
var mimeType    = require('../../../assets/mime-types');

var router      = express.Router();

var create 		= require('./C_Riwayat_Nilai.js');
var read 		= require('./R_Riwayat_Nilai.js');
var update 		= require('./U_Riwayat_Nilai.js');
var discard 	= require('./D_Riwayat_Nilai.js');

const Program = 'R_Nilai';

var Data = {
	Status	: 1000
};

class RiwayatNilai {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'r_nilai'
	};
	
	#tableColumn	= {
		tableColumn : {
			nilai_id: {name: 'nilai_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
		    santri_id: {name: 'santri_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			kelompok_id: {name: 'kelompok_id', datatype: 'varchar', length: 25, isNotNull: true, defaultvalue: '', value: null},	
			keterangan_nilai: {name: 'keterangan_nilai', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			mapel_id: {name: 'mapel_id', datatype: 'int', length: 5, isNotNull: true, defaultvalue: null, value: null},
			tipe_nilai: {name: 'tipe_nilai', datatype: 'char', length: 1, isNotNull: true, defaultvalue: null, value: null},
			mapel_nama: {name: 'mapel_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			nama_kelas: {name: 'nama_kelas', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			nilai: {name: 'nilai', datatype: 'decimal', length: 10.2, isNotNull: true, defaultvalue: null, value: null},
			tanggal_nilai: {name: 'tanggal_nilai', datatype: 'date', length: 6, isNotNull: true, defaultvalue: null, value: null},
			nama_lengkap_santri: {name: 'nama_lengkap_santri', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			kode_mapel: {name: 'kode_mapel', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			kode_santri: {name: 'kode_santri', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetRiwayatNilai() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetRiwayatNilai(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.nilai_id.value = middleware.Decrypt(value.body.nilai_id);
     	this.#tableColumn.tableColumn.santri_id.value = middleware.Decrypt(value.body.santri_id);
		this.#tableColumn.tableColumn.keterangan_nilai.value = middleware.Decrypt(value.body.keterangan_nilai);
		this.#tableColumn.tableColumn.mapel_id.value = middleware.Decrypt(value.body.mapel_id);
		this.#tableColumn.tableColumn.tipe_nilai.value = middleware.Decrypt(value.body.tipe_nilai);
		this.#tableColumn.tableColumn.kelompok_id.value = middleware.Decrypt(value.body.kelompok_id);
		var date = middleware.Decrypt(value.body.tanggal_nilai);
		this.#tableColumn.tableColumn.tanggal_nilai.value = date.split("-").reverse().join("-");
		this.#tableColumn.tableColumn.nilai.value = middleware.Decrypt(value.body.nilai);
		this.#tableColumn.tableColumn.mapel_nama.value = middleware.Decrypt(value.body.mapel_nama);
		this.#tableColumn.tableColumn.nama_kelas.value = middleware.Decrypt(value.body.nama_kelas);
		this.#tableColumn.tableColumn.kode_mapel.value = middleware.Decrypt(value.body.kode_mapel);
		this.#tableColumn.tableColumn.nama_lengkap_santri.value = middleware.Decrypt(value.body.nama_lengkap_santri);
		this.#tableColumn.tableColumn.kode_santri.value = middleware.Decrypt(value.body.kode_santri);

    }
}

router.post('/', function (req, res)  {
	let Init 		= new RiwayatNilai();
	Init.SetRiwayatNilai 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let RiwayatNilaiData 	= Init.GetRiwayatNilai;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, RiwayatNilaiData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, RiwayatNilaiData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, RiwayatNilaiData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, RiwayatNilaiData);
		} else {
			if (middleware.TriggerValidate(Identity.Trigger) && middleware.Permission(Identity) == false) {
				Data.Status	= 3002;
				middleware.Response(res, Data);
			} else {
				Data.Status	= 3000;
				middleware.Response(res, Data);
			}
		}
	} else {
		Data.Status	= 3001;
		middleware.Response(res, Data);
	}
})

function ResetData() {
	Data.Status 	= 1000;
}


module.exports = router;
