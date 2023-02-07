var express     = require('express');
var middleware  = require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var create 		= require('./C_Absensi.js');
var read 		= require('./R_Absensi.js');
var update 		= require('./U_Absensi.js');
var discard 	= require('./D_Absensi.js');

const Program = 'Absensi';

var Data = {
	Status	: 1000
};

class Absensi {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'r_absensi'
	};
	
	#tableColumn	= {
		tableColumn : {
			absensi_id: {name: 'absensi_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 0, value: null},
			jadwal_id: {name: 'jadwal_id', datatype: 'int', length: 5, isNotNull: true, defaultvalue: 0, value: null},
			status_kehadiran: {name: 'status_kehadiran', datatype: 'int', length: 1, isNotNull: true, defaultvalue: 0, value: null},
			keterangan_absensi: {name: 'keterangan_absensi', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: true, value: null},
            santri_id: {name: 'santri_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			tanggal_absensi: {name: 'tanggal_absensi', datatype: 'date', length: 100, isNotNull: true, defaultvalue: true, value: null},
			nama_lengkap_santri: {name: 'nama_lengkap_santri', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			mapel_id: {name: 'mapel_id', datatype: 'int', length: 20, isNotNull: true, defaultvalue: null, value: null},
			tahun_id: {name: 'tahun_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null},
			pengajar_id: {name: 'pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			kelas_id: {name: 'kelas_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetAbsensi() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetAbsensi(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.absensi_id.value = middleware.Decrypt(value.body.absensi_id);
		this.#tableColumn.tableColumn.jadwal_id.value = middleware.Decrypt(value.body.jadwal_id);
		this.#tableColumn.tableColumn.status_kehadiran.value = middleware.Decrypt(value.body.status_kehadiran);
        this.#tableColumn.tableColumn.keterangan_absensi.value = middleware.Decrypt(value.body.keterangan_absensi);
        this.#tableColumn.tableColumn.santri_id.value = middleware.Decrypt(value.body.santri_id);
		var date = middleware.Decrypt(value.body.tanggal_absensi);
		this.#tableColumn.tableColumn.tanggal_absensi.value = date.split("-").reverse().join("-");
		this.#tableColumn.tableColumn.nama_lengkap_santri.value = middleware.Decrypt(value.body.nama_lengkap_santri);
		this.#tableColumn.tableColumn.mapel_id.value = middleware.Decrypt(value.body.mapel_id);
		this.#tableColumn.tableColumn.tahun_id.value = middleware.Decrypt(value.body.tahun_id);
		this.#tableColumn.tableColumn.pengajar_id.value = middleware.Decrypt(value.body.pengajar_id);
		this.#tableColumn.tableColumn.kelas_id.value = middleware.Decrypt(value.body.kelas_id);

    }
}

router.post('/', function (req, res)  {
	let Init 		= new Absensi();
	Init.SetAbsensi 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let AbsensiData 	= Init.GetAbsensi;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, AbsensiData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, AbsensiData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, AbsensiData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, AbsensiData);
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
