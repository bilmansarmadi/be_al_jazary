var express     = require('express');
var middleware  = require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var create 		= require('./C_Kelompok_kelas.js');
var read 		= require('./R_Kelompok_Kelas.js');
var update 		= require('./U_Kelompok_Kelas.js');
var discard 	= require('./D_Kelompok_kelas.js');

const Program = 'K_Kelas';

var Data = {
	Status	: 1000
};

class KelompokKelas {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'k_kelas'
	};
	
	#tableColumn	= {
		tableColumn : {
			kelompok_id: {name: 'kelompok_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
		    santri_id: {name: 'santri_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			jadwal_id: {name: 'jadwal_id', datatype: 'int', length: 5, isNotNull: true, defaultvalue: null, value: null},
			mapel_nama: {name: 'mapel_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			nama_lengkap_santri: {name: 'nama_lengkap_santri', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			kode_mapel: {name: 'kode_mapel', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			kode_santri: {name: 'kode_santri', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetKelompokKelas() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetKelompokKelas(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.kelompok_id.value = middleware.Decrypt(value.body.kelompok_id);
     	this.#tableColumn.tableColumn.santri_id.value = middleware.Decrypt(value.body.santri_id);
		this.#tableColumn.tableColumn.jadwal_id.value = middleware.Decrypt(value.body.jadwal_id);
		this.#tableColumn.tableColumn.mapel_nama.value = middleware.Decrypt(value.body.mapel_nama);
		this.#tableColumn.tableColumn.kode_mapel.value = middleware.Decrypt(value.body.kode_mapel);
		this.#tableColumn.tableColumn.nama_lengkap_santri.value = middleware.Decrypt(value.body.nama_lengkap_santri);
		this.#tableColumn.tableColumn.kode_santri.value = middleware.Decrypt(value.body.kode_santri);

    }
}

router.post('/', function (req, res)  {
	let Init 		= new KelompokKelas();
	Init.SetKelompokKelas 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let KelompokKelasData 	= Init.GetKelompokKelas;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, KelompokKelasData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, KelompokKelasData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, KelompokKelasData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, KelompokKelasData);
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
