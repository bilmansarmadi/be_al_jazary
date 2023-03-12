var express 	= require('express');
var middleware 	= require('nox');;
var router 		= express.Router();

var create 		= require('./C_Kelas.js');
var read 		= require('./R_Kelas.js');
var update 		= require('./U_Kelas.js');
var discard 	= require('./D_Kelas.js');

const Program = 'Kelas';

var Data = {
	Status	: 1000
};

class Kelas {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_kelas'
	};
	
	#tableColumn	= {
		tableColumn : {
			kelas_id: {name: 'kelas_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null},
			nama_kelas: {name: 'nama_kelas', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			deskripsi_kelas: {name: 'deskripsi_kelas', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			status_kelas: {name: 'status_kelas', datatype: 'int', length: 1, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetKelas() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetKelas(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.kelas_id.value = middleware.Decrypt(value.body.kelas_id);
		this.#tableColumn.tableColumn.nama_kelas.value = middleware.Decrypt(value.body.nama_kelas);
		this.#tableColumn.tableColumn.deskripsi_kelas.value = middleware.Decrypt(value.body.deskripsi_kelas);
		this.#tableColumn.tableColumn.status_kelas.value = middleware.Decrypt(value.body.status_kelas);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Kelas ();
	Init.SetKelas = req;
	
	let Identity 	= Init.GetIdentity;	
	let KelasData 	= Init.GetKelas;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, KelasData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res,KelasData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, KelasData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, KelasData);
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
