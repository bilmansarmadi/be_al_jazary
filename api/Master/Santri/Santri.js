var express     = require('express');
var middleware  = require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var ext 			                = '';
var extFoto           = '';
var uniqueSuffix 	                = '';
var uniqueSuffixFoto  = '';

var storage = multer.diskStorage({
	filename: (req, file, cb) => {
            ext = mimeType.extension(file.mimetype)
            uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix +"."+ext)
        
	},

	destination: (req, file, cb) => {
            cb(null, 'public/images');
  	}
})

var upload = multer({ storage: storage, fileFilter: ImageFilter, limits:{ fieldSize: 10485760 } })


var create 		= require('./C_Santri.js');
var read 		= require('./R_Santri.js');
var update 		= require('./U_Santri.js');
var discard 	= require('./D_Santri.js');

const Program = 'Santri';

var Data = {
	Status	: 1000
};

class Santri {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_santri'
	};
	
	#tableColumn	= {
		tableColumn : {
			santri_id: {name: 'santri_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 0, value: null},
			kode_santri: {name: 'kode_santri', datatype: 'int', length: 100, isNotNull: true, defaultvalue: 0, value: null},
			nama_lengkap_santri: {name: 'nama_lengkap_santri', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			panggilan: {name: 'panggilan', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
			tanggal_lahir: {name: 'tanggal_lahir', datatype: 'date', length: 100, isNotNull: true, defaultvalue: true, value: null},
            tempat_lahir: {name: 'tempat_lahir', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			anak_ke: {name: 'anak_ke', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 0, value: null},
            alamat: {name: 'alamat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			berat_badan: {name: 'berat_badan', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 1, value: null},
			tinggi_badan: {name: 'tinggi_badan', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 1, value: null},
			email: {name: 'email', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
            hp_ortu: {name: 'hp_ortu', datatype: 'int', length: 20, isNotNull: true, defaultvalue: 0, value: null},
            hafalan_mutqin: {name: 'hafalan_mutqin', datatype: 'varchar', length: 11, isNotNull: true, defaultvalue: 0, value: null},
            hafalan_ziyadah: {name: 'hafalan_ziyadah', datatype: 'varchar', length: 11, isNotNull: true, defaultvalue: 0, value: null},
            nama_ayah: {name: 'nama_ayah', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
            nama_ibu: {name: 'nama_ibu', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			jenis_kelamin: {name: 'jenis_kelamin', datatype: 'char', length: 1, isNotNull: true, defaultvalue: 'L', value: null},
            foto: {name: 'foto', datatype: 'varchar', length: 1000, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetSantri() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetSantri(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.santri_id.value = middleware.Decrypt(value.body.santri_id);
		this.#tableColumn.tableColumn.kode_santri.value = middleware.Decrypt(value.body.kode_santri);
		this.#tableColumn.tableColumn.nama_lengkap_santri.value = middleware.Decrypt(value.body.nama_lengkap_santri);
		this.#tableColumn.tableColumn.panggilan.value = middleware.Decrypt(value.body.panggilan);
        this.#tableColumn.tableColumn.tempat_lahir.value = middleware.Decrypt(value.body.tempat_lahir);
		var date = middleware.Decrypt(value.body.tanggal_lahir);
		this.#tableColumn.tableColumn.tanggal_lahir.value = date.split("-").reverse().join("-");
        this.#tableColumn.tableColumn.anak_ke.value = middleware.Decrypt(value.body.anak_ke);
        this.#tableColumn.tableColumn.alamat.value = middleware.Decrypt(value.body.alamat);
		this.#tableColumn.tableColumn.berat_badan.value = middleware.Decrypt(value.body.berat_badan);
        this.#tableColumn.tableColumn.tinggi_badan.value = middleware.Decrypt(value.body.tinggi_badan);
        this.#tableColumn.tableColumn.email.value = middleware.Decrypt(value.body.email);
        this.#tableColumn.tableColumn.hafalan_mutqin.value = middleware.Decrypt(value.body.hafalan_mutqin);
        this.#tableColumn.tableColumn.hafalan_ziyadah.value = middleware.Decrypt(value.body.hafalan_ziyadah);
        this.#tableColumn.tableColumn.nama_ayah.value = middleware.Decrypt(value.body.nama_ayah);
        this.#tableColumn.tableColumn.nama_ibu.value = middleware.Decrypt(value.body.nama_ibu);
        this.#tableColumn.tableColumn.hp_ortu.value = middleware.Decrypt(value.body.hp_ortu);
		this.#tableColumn.tableColumn.jenis_kelamin.value = middleware.Decrypt(value.body.jenis_kelamin);
        this.#tableColumn.tableColumn.foto.value = (middleware.Decrypt(value.body.foto) != '') ? middleware.Decrypt(value.body.foto.substr(64)) : uniqueSuffix+"."+ext;

    }
}

router.post('/', upload.fields([{ name: 'foto', maxCount: 1 }]), function (req, res) {
	let Init 		= new Santri();
	Init.SetSantri 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let SantriData 	= Init.GetSantri;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, SantriData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, SantriData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, SantriData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, SantriData);
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

function ImageFilter(req, file, cb) {
	if (!file.originalname.match(/\.(png|jpeg|jpg|gif)/)) {
	  cb(new Error('Only images are allowed'), false) // setting the second param
	}
	cb(null, true)
}

module.exports = router;
