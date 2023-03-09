var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Mapel.js');
var read 		= require('./R_Mapel.js');
var update 		= require('./U_Mapel.js');
var discard 	= require('./D_Mapel.js');

const Program = 'Mapel';

var Data = {
	Status	: 1000
};

class Mapel {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_mapel'
	};
	
	#tableColumn	= {
		tableColumn : {
			mapel_id: {name: 'mapel_id', datatype: 'int', length: 20, isNotNull: true, defaultvalue: null, value: null},
			mapel_nama: {name: 'mapel_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			status_mapel: {name: 'status_mapel', datatype: 'int', length: 1, isNotNull: true, defaultvalue: 1, value: null},
			kode_mapel: {name: 'kode_mapel', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: ''},
			deskripsi: {name: 'deskripsi', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: ''},
			sks: {name: 'sks', datatype: 'int', length: 2, isNotNull: false, defaultvalue: 1, value: null},
			kategori_id: {name: 'kategori_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetMapel() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetMapel(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.mapel_id.value = middleware.Decrypt(value.body.mapel_id);
		this.#tableColumn.tableColumn.sks.value = middleware.Decrypt(value.body.sks);
		this.#tableColumn.tableColumn.mapel_nama.value = middleware.Decrypt(value.body.mapel_nama);
		this.#tableColumn.tableColumn.kode_mapel.value = middleware.Decrypt(value.body.kode_mapel);
		this.#tableColumn.tableColumn.status_mapel.value = middleware.Decrypt(value.body.status_mapel);
		this.#tableColumn.tableColumn.deskripsi.value = middleware.Decrypt(value.body.deskripsi);
		this.#tableColumn.tableColumn.kategori_id.value = middleware.Decrypt(value.body.kategori_id);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Mapel();
	Init.SetMapel 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let MapelData 	= Init.GetMapel;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, MapelData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, MapelData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, MapelData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, MapelData);
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
