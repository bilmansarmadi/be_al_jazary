var express 	= require('express');
var middleware = require('../../assets/nox');
var router 		= express.Router();

var create 		= require('./C_Pengajaran.js');
var read 		= require('./R_Pengajaran.js');
var update 		= require('./U_Pengajaran.js');
var discard 	= require('./D_Pengajaran.js');

const Program = 'Pengajaran';

var Data = {
	Status	: 1000
};

class Pengajaran {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_pengajaran'
	};
	
	#tableColumn	= {
		tableColumn : {
			jadwal_id: {name: 'jadwal_id', datatype: 'varchar', length: 5, isNotNull: true, defaultvalue: null, value: null},
			jam_mulai: {name: 'jam_mulai', datatype: 'time', length: 25, isNotNull: true, defaultvalue: null, value: null},
			jam_akhir: {name: 'jam_akhir', datatype: 'time', length: 25, isNotNull: true, defaultvalue: null, value: null},
			nip: {name: 'nip', datatype: 'int', length: 18, isNotNull: true, defaultvalue: 0, value: null},
			nama_lengkap: {name: 'nama_lengkap', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			pengajar_id: {name: 'pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			mapel_id: {name: 'mapel_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 0, value: null},
			nama_kelas: {name: 'nama_kelas', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			tahun_id: {name: 'tahun_id', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 0, value: null},
			mapel_nama: {name: 'mapel_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			kode_mapel: {name: 'kode_mapel', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			hari: {name: 'hari', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: '', value: null},
			kelas_id: {name: 'kelas_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 1, value: null},
			keterangan_pengajaran: {name: 'keterangan_pengajaran', datatype: 'varhar', length: 200, isNotNull: false, defaultvalue: '', value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetPengajaran() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetPengajaran(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.jadwal_id.value = middleware.Decrypt(value.body.jadwal_id);
		this.#tableColumn.tableColumn.hari.value = middleware.Decrypt(value.body.hari);
		this.#tableColumn.tableColumn.jam_mulai.value = middleware.Decrypt(value.body.jam_mulai);
		this.#tableColumn.tableColumn.jam_akhir.value = middleware.Decrypt(value.body.jam_akhir);
		this.#tableColumn.tableColumn.mapel_id.value = middleware.Decrypt(value.body.mapel_id);
		this.#tableColumn.tableColumn.mapel_nama.value = middleware.Decrypt(value.body.mapel_nama);
		this.#tableColumn.tableColumn.kode_mapel.value = middleware.Decrypt(value.body.kode_mapel);
		this.#tableColumn.tableColumn.pengajar_id.value = middleware.Decrypt(value.body.pengajar_id);
		this.#tableColumn.tableColumn.nip.value = middleware.Decrypt(value.body.nip);
		this.#tableColumn.tableColumn.nama_lengkap.value = middleware.Decrypt(value.body.nama_lengkap);
		this.#tableColumn.tableColumn.tahun_id.value = middleware.Decrypt(value.body.tahun_id);
		this.#tableColumn.tableColumn.kelas_id.value = middleware.Decrypt(value.body.kelas_id);
		this.#tableColumn.tableColumn.nama_kelas.value = middleware.Decrypt(value.body.nama_kelas);
		this.#tableColumn.tableColumn.keterangan_pengajaran.value = middleware.Decrypt(value.body.keterangan_pengajaran);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Pengajaran();
	Init.SetPengajaran 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let PengajaranData 	= Init.GetPengajaran;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, PengajaranData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, PengajaranData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, PengajaranData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, PengajaranData);
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
