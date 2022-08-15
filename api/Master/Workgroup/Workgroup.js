var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Workgroup.js');
var read 		= require('./R_Workgroup.js');
var update 		= require('./U_Workgroup.js');
var discard 	= require('./D_Workgroup.js');

const Program = 'Workgroup';

var Data = {
	Status	: 1000
};

class Workgroup {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'workgroup'
	};
	
	#tableColumn	= {
		tableColumn : {
			workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_id_old: {name: 'workgroup_id_old', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_name: {name: 'workgroup_name', datatype: 'varchar', length: 25, isNotNull: true, defaultvalue: null, value: null},
			workgroup_address: {name: 'workgroup_address', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			workgroup_phone: {name: 'workgroup_phone', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			workgroup_desc: {name: 'workgroup_desc', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: '', value: null},
			workgroup_type: {name: 'workgroup_type', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 15, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 15, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'tinyint', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetWorkgroup() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetWorkgroup(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
		this.#tableColumn.tableColumn.workgroup_id_old.value = middleware.Decrypt(value.body.workgroup_id_old);
		this.#tableColumn.tableColumn.workgroup_name.value = middleware.Decrypt(value.body.workgroup_name);
		this.#tableColumn.tableColumn.workgroup_address.value = middleware.Decrypt(value.body.workgroup_address);
		this.#tableColumn.tableColumn.workgroup_phone.value = middleware.Decrypt(value.body.workgroup_phone);
		this.#tableColumn.tableColumn.workgroup_desc.value = middleware.Decrypt(value.body.workgroup_desc);
		this.#tableColumn.tableColumn.workgroup_type.value = middleware.Decrypt(value.body.workgroup_type);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function (req, res) {
	let Init 			= new Workgroup();
	Init.SetWorkgroup 	= req;
	
	let Identity 		= Init.GetIdentity;	
	let WorkgroupData 	= Init.GetWorkgroup;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, WorkgroupData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, WorkgroupData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, WorkgroupData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, WorkgroupData);
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
