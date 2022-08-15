var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Division.js');
var read 		= require('./R_Division.js');
var update 		= require('./U_Division.js');
var discard 	= require('./D_Division.js');

const Program = 'Division';

var Data = {
	Status: 1000
};

class Division {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'division'
	};
	
	#tableColumn = {
		tableColumn: {
			division_id: {name: 'division_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			division_name: {name: 'division_name', datatype: 'varchar', length: 25, isNotNull: true, defaultvalue: '', value: null},
			division_desc: {name: 'division_desc', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: '', value: null},
			division_type: {name: 'division_type', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 15, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 15, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetDivision() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetDivision(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.division_id.value = middleware.Decrypt(value.body.division_id);
		this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
		this.#tableColumn.tableColumn.division_name.value = middleware.Decrypt(value.body.division_name);
		this.#tableColumn.tableColumn.division_desc.value = middleware.Decrypt(value.body.division_desc);
		this.#tableColumn.tableColumn.division_type.value = middleware.Decrypt(value.body.division_type);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init = new Division();
	Init.SetDivision = req;
	
	let Identity = Init.GetIdentity;	
	let DivisionData = Init.GetDivision;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, DivisionData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, DivisionData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, DivisionData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, DivisionData);
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
