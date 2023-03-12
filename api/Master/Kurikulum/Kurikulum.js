var express     = require('express');
var middleware 	= require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var create 		= require('./C_Kurikulum.js');
var read 		= require('./R_Kurikulum.js');
var update 		= require('./U_Kurikulum.js');
var discard 	= require('./D_Kurikulum.js');

const Program = 'M_Kurikulum';

var Data = {
	Status	: 1000
};

class Kurikulum {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_kurikulum'
	};
	
	#tableColumn	= {
		tableColumn : {
			kurikulum_id: {name: 'kurikulum_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
			kurikulum_nama: {name: 'kurikulum_nama', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			kurikulum_status: {name: 'kurikulum_status', datatype: 'int', length: 1, isNotNull: true, defaultvalue: null, value: null}

		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetKurikulum() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetKurikulum(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.kurikulum_id.value = middleware.Decrypt(value.body.kurikulum_id);
     	this.#tableColumn.tableColumn.kurikulum_nama.value = middleware.Decrypt(value.body.kurikulum_nama);
		this.#tableColumn.tableColumn.kurikulum_status.value = middleware.Decrypt(value.body.kurikulum_status);
    }
}

router.post('/', function (req, res)  {
	let Init 		= new Kurikulum();
	Init.SetKurikulum 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let KurikulumData 	= Init.GetKurikulum;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, KurikulumData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, KurikulumData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, KurikulumData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, KurikulumData);
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
