var express     = require('express');
var middleware 	= require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var create 		= require('./C_Riwayat_Mengajar.js');
var read 		= require('./R_Riwayat_Mengajar.js');
var update 		= require('./U_Riwayat_Mengajar.js');
var discard 	= require('./D_Riwayat_Mengajar.js');

const Program = 'R_Mengajar';

var Data = {
	Status	: 1000
};

class RiwayatMengajar {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'r_mengajar'
	};
	
	#tableColumn	= {
		tableColumn : {
			r_mengajar_id: {name: 'r_mengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
		    pengajar_id: {name: 'pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			nama_sekolah: {name: 'nama_sekolah', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			dari_tahun: {name: 'dari_tahun', datatype: 'int', length: 7, isNotNull: true, defaultvalue: null, value: null},
			sampai_tahun: {name: 'sampai_tahun', datatype: 'int', length: 7, isNotNull: true, defaultvalue: null, value: null},
			alamat_riwayat: {name: 'alamat_riwayat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			keterangan_riwayat: {name: 'keterangan_riwayat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			nama_lengkap: {name: 'nama_lengkap', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			nip: {name: 'nip', datatype: 'int', length: 25, isNotNull: true, defaultvalue: '', value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetRiwayatMengajar() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetRiwayatMengajar(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.r_mengajar_id.value = middleware.Decrypt(value.body.r_mengajar_id);
     	this.#tableColumn.tableColumn.pengajar_id.value = middleware.Decrypt(value.body.pengajar_id);
		this.#tableColumn.tableColumn.nama_sekolah.value = middleware.Decrypt(value.body.nama_sekolah);
		this.#tableColumn.tableColumn.dari_tahun.value = middleware.Decrypt(value.body.dari_tahun);
		this.#tableColumn.tableColumn.sampai_tahun.value = middleware.Decrypt(value.body.sampai_tahun);
		this.#tableColumn.tableColumn.alamat_riwayat.value = middleware.Decrypt(value.body.alamat_riwayat);
		this.#tableColumn.tableColumn.nama_lengkap.value = middleware.Decrypt(value.body.nama_lengkap);
		this.#tableColumn.tableColumn.keterangan_riwayat.value = middleware.Decrypt(value.body.keterangan_riwayat);
		this.#tableColumn.tableColumn.nip.value = middleware.Decrypt(value.body.nip);

    }
}

router.post('/', function (req, res)  {
	let Init 		= new RiwayatMengajar();
	Init.SetRiwayatMengajar 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let RiwayatMengajarData 	= Init.GetRiwayatMengajar;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, RiwayatMengajarData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, RiwayatMengajarData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, RiwayatMengajarData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, RiwayatMengajarData);
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
