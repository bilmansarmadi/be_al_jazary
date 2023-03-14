var express     = require('../../../assets/express');
var middleware 	= require('../../../assets/nox');
var multer      = require('../../../assets/multer');
var mimeType    = require('../../../assets/mime-types');

var router      = express.Router();

var create 		= require('./C_Riwayat_Pendidikan_Pengajar.js');
var read 		= require('./R_Riwayat_Pendidikan_Pengajar.js');
var update 		= require('./U_Riwayat_Pendidikan_Pengajar.js');
var discard 	= require('./D_Riwayat_Pendidikan_Pengajar.js');

const Program = 'R_Pendidikan_Pengajar';

var Data = {
	Status	: 1000
};

class RiwayatPendidikanPengajar {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'r_pendidikan_pengajar'
	};
	
	#tableColumn	= {
		tableColumn : {
			r_pendidikan_pengajar_id: {name: 'r_pendidikan_pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
			tingkat: {name: 'tingkat', datatype: 'int', length: 10, isNotNull: true, defaultvalue: '', value: null},
            pengajar_id: {name: 'pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			nama_sekolah: {name: 'nama_sekolah', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			tahun_masuk: {name: 'tahun_masuk', datatype: 'int', length: 7, isNotNull: true, defaultvalue: null, value: null},
			tahun_lulus: {name: 'tahun_lulus', datatype: 'int', length: 7, isNotNull: true, defaultvalue: null, value: null},
			alamat_riwayat: {name: 'alamat_riwayat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			keterangan_riwayat: {name: 'keterangan_riwayat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			status_sekolah: {name: 'status_sekolah', datatype: 'int', length: 1, isNotNull: true, defaultvalue: null, value: null},
			nama_lengkap: {name: 'nama_lengkap', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			nip: {name: 'nip', datatype: 'int', length: 25, isNotNull: true, defaultvalue: '', value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetRiwayatPendidikanPengajar() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetRiwayatPendidikanPengajar(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.r_pendidikan_pengajar_id.value = middleware.Decrypt(value.body.r_pendidikan_pengajar_id);
        this.#tableColumn.tableColumn.tingkat.value = middleware.Decrypt(value.body.tingkat);
		this.#tableColumn.tableColumn.pengajar_id.value = middleware.Decrypt(value.body.pengajar_id);
		this.#tableColumn.tableColumn.nama_sekolah.value = middleware.Decrypt(value.body.nama_sekolah);
		this.#tableColumn.tableColumn.tahun_masuk.value = middleware.Decrypt(value.body.tahun_masuk);
		this.#tableColumn.tableColumn.tahun_lulus.value = middleware.Decrypt(value.body.tahun_lulus);
		this.#tableColumn.tableColumn.alamat_riwayat.value = middleware.Decrypt(value.body.alamat_riwayat);
		this.#tableColumn.tableColumn.nama_lengkap.value = middleware.Decrypt(value.body.nama_lengkap);
		this.#tableColumn.tableColumn.keterangan_riwayat.value = middleware.Decrypt(value.body.keterangan_riwayat);
		this.#tableColumn.tableColumn.status_sekolah.value = middleware.Decrypt(value.body.status_sekolah);
		this.#tableColumn.tableColumn.nip.value = middleware.Decrypt(value.body.nip);

    }
}

router.post('/', function (req, res)  {
	let Init 		= new RiwayatPendidikanPengajar();
	Init.SetRiwayatPendidikanPengajar 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let RiwayatPendidikanPengajarData 	= Init.GetRiwayatPendidikanPengajar;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, RiwayatPendidikanPengajarData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, RiwayatPendidikanPengajarData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, RiwayatPendidikanPengajarData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, RiwayatPendidikanPengajarData);
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
