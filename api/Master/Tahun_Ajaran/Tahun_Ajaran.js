var express 	= require('express');
var middleware 	= require('nox');;
var router 		= express.Router();

var create 		= require('./C_Tahun_Ajaran.js');
var read 		= require('./R_Tahun_Ajaran.js');
var update 		= require('./U_Tahun_Ajaran.js');
var discard 	= require('./D_Tahun_Ajaran.js');

const Program = 'Tahun_Ajaran';

var Data = {
	Status	: 1000
};

class Tahun_Ajaran {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_tahun_ajaran'
	};
	
	#tableColumn	= {
		tableColumn : {
			tahun_id: {name: 'tahun_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null},
			tahun_ajaran: {name: 'tahun_ajaran', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null},
			tipe_ajaran: {name: 'tipe_ajaran', datatype: 'int', length: 1, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetTahunAjaran() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetTahunAjaran(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.tahun_id.value = middleware.Decrypt(value.body.tahun_id);
		this.#tableColumn.tableColumn.tahun_ajaran.value = middleware.Decrypt(value.body.tahun_ajaran);
		this.#tableColumn.tableColumn.tipe_ajaran.value = middleware.Decrypt(value.body.tipe_ajaran);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Tahun_Ajaran();
	Init.SetTahunAjaran = req;
	
	let Identity 	= Init.GetIdentity;	
	let TahunAjaranData = Init.GetTahunAjaran;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, TahunAjaranData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res,TahunAjaranData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, TahunAjaranData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, TahunAjaranData);
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
