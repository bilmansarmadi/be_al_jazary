var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Coa_Type.js');
var read 		= require('./R_Coa_Type.js');
var update 		= require('./U_Coa_Type.js');
var discard 	= require('./D_Coa_Type.js');

const Program = 'Coa_Type';

var Data = {
	Status: 1000
};

class Coa_Type {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'coa_type'
	};
	
	#tableColumn = {
		tableColumn: {
			type_code: {name: 'type_code', datatype: 'varchar', length: 5, isNotNull: true, defaultvalue: null, value: null},
			type_description: {name: 'type_description', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: false, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetCoaType() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetCoaType(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.type_code.value = middleware.Decrypt(value.body.type_code);
		this.#tableColumn.tableColumn.type_description.value = middleware.Decrypt(value.body.type_description);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init 			= new Coa_Type();
	Init.SetCoaType 	= req;
	
	let Identity 		= Init.GetIdentity;	
	let CoaTypeData 	= Init.GetCoaType;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, CoaTypeData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, CoaTypeData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, CoaTypeData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, CoaTypeData);
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
	Data.Status = 1000;
}

module.exports = router;
