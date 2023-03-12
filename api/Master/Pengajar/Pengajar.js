var express     = require('express');
var middleware 	= require('nox');
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


var create 		= require('./C_Pengajar.js');
var read 		= require('./R_Pengajar.js');
var update 		= require('./U_Pengajar.js');
var discard 	= require('./D_Pengajar.js');

const Program = 'Pengajar';

var Data = {
	Status	: 1000
};

class Pengajar {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_pengajar'
	};
	
	#tableColumn	= {
		tableColumn : {
			pengajar_id: {name: 'pengajar_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			nip: {name: 'nip', datatype: 'int', length: 18, isNotNull: true, defaultvalue: 0, value: null},
			nama_lengkap: {name: 'nama_lengkap', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			panggilan: {name: 'panggilan', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: 0, value: null},
			tanggal_lahir: {name: 'tanggal_lahir', datatype: 'date', length: 100, isNotNull: true, defaultvalue: true, value: null},
			alamat: {name: 'alamat', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			berat_badan: {name: 'berat_badan', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 1, value: null},
			tinggi_badan: {name: 'tinggi_badan', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 1, value: null},
			email: {name: 'email', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
            hafalan_mutqin: {name: 'hafalan_mutqin', datatype: 'varchar', length: 11, isNotNull: true, defaultvalue: 0, value: null},
            status_nikah: {name: 'status_nikah', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 0, value: null},
            foto: {name: 'foto', datatype: 'longblob', length: 1000, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetPengajar() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetPengajar(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.pengajar_id.value = middleware.Decrypt(value.body.pengajar_id);
		this.#tableColumn.tableColumn.nip.value = middleware.Decrypt(value.body.nip);
		this.#tableColumn.tableColumn.nama_lengkap.value = middleware.Decrypt(value.body.nama_lengkap);
		this.#tableColumn.tableColumn.panggilan.value = middleware.Decrypt(value.body.panggilan);
        this.#tableColumn.tableColumn.tanggal_lahir.value = middleware.Decrypt(value.body.tanggal_lahir);
		this.#tableColumn.tableColumn.alamat.value = middleware.Decrypt(value.body.alamat);
		this.#tableColumn.tableColumn.berat_badan.value = middleware.Decrypt(value.body.berat_badan);
        this.#tableColumn.tableColumn.tinggi_badan.value = middleware.Decrypt(value.body.tinggi_badan);
        this.#tableColumn.tableColumn.email.value = middleware.Decrypt(value.body.email);
        this.#tableColumn.tableColumn.hafalan_mutqin.value = middleware.Decrypt(value.body.hafalan_mutqin);
        this.#tableColumn.tableColumn.status_nikah.value = middleware.Decrypt(value.body.status_nikah);
        this.#tableColumn.tableColumn.foto.value = (middleware.Decrypt(value.body.foto) != '') ? middleware.Decrypt(value.body.foto.substr(64)) : uniqueSuffix+"."+ext;

    }
}

router.post('/', upload.fields([{ name: 'foto', maxCount: 1 }]), function (req, res) {
	let Init 		= new Pengajar();
	Init.SetPengajar 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let PengajarData 	= Init.GetPengajar;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, PengajarData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, PengajarData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, PengajarData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, PengajarData);
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
