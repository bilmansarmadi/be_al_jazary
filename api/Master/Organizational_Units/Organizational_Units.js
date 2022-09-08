var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Organizational_Units.js');
var read 		= require('./R_Organizational_Units.js');
var update 		= require('./U_Organizational_Units.js');
var discard 	= require('./D_Organizational_Units.js');

const Program = 'Organizational_Units';

var Data = {
	Status: 1000
};

class Organizational_Units {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'organizational_units'
	};
	
	#tableColumn = {
		tableColumn: {
			organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			organizational_unit_name: {name: 'organizational_unit_name', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
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
	
	get GetOrganizationalUnits() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetOrganizationalUnits(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
		this.#tableColumn.tableColumn.organizational_unit_name.value = middleware.Decrypt(value.body.organizational_unit_name);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init = new Organizational_Units();
	Init.SetOrganizationalUnits = req;
	
	let Identity = Init.GetIdentity;	
	let OrganizationalUnitsData = Init.GetOrganizationalUnits;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, OrganizationalUnitsData);
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, OrganizationalUnitsData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, OrganizationalUnitsData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, OrganizationalUnitsData);
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
