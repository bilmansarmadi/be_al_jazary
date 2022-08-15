var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Coa.js');
var read 		= require('./R_Coa.js');
var update 		= require('./U_Coa.js');
var discard 	= require('./D_Coa.js');

const Program = 'Coa';

var Data = {
	Status: 1000
};

class Coa {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'coa'
	};
	
	#tableColumn = {
		tableColumn: {
			coa_code: {name: 'coa_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			coa_description: {name: 'coa_description', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
			type_code: {name: 'type_code', datatype: 'varchar', length: 5, isNotNull: true, defaultvalue: null, value: null},
			control_account: {name: 'control_account', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 0, value: null},
			coa_position: {name: 'coa_position', datatype: 'varchar', length: 1, isNotNull: true, defaultvalue: null, value: null},
			ptd_dbalance: {name: 'ptd_dbalance', datatype: 'decimal', length: 10.0, isNotNull: false, defaultvalue: 0, value: null},
			ptd_cbalance: {name: 'ptd_cbalance', datatype: 'decimal', length: 10.0, isNotNull: false, defaultvalue: 0, value: null},
			current_balance: {name: 'current_balance', datatype: 'decimal', length: 10.0, isNotNull: false, defaultvalue: 0, value: null},
			prev_balance: {name: 'prev_balance', datatype: 'decimal', length: 10.0, isNotNull: false, defaultvalue: 0, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetCoa() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetCoa(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.coa_code.value = middleware.Decrypt(value.body.coa_code);
		this.#tableColumn.tableColumn.coa_description.value = middleware.Decrypt(value.body.coa_description);
		this.#tableColumn.tableColumn.type_code.value = middleware.Decrypt(value.body.type_code);
		this.#tableColumn.tableColumn.control_account.value = middleware.Decrypt(value.body.control_account);
		this.#tableColumn.tableColumn.coa_position.value = middleware.Decrypt(value.body.coa_position);
		this.#tableColumn.tableColumn.ptd_dbalance.value = middleware.Decrypt(value.body.ptd_dbalance);
		this.#tableColumn.tableColumn.ptd_cbalance.value = middleware.Decrypt(value.body.ptd_cbalance);
		this.#tableColumn.tableColumn.current_balance.value = middleware.Decrypt(value.body.current_balance);
		this.#tableColumn.tableColumn.prev_balance.value = middleware.Decrypt(value.body.prev_balance);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init = new Coa();
	Init.SetCoa = req;
	
	let Identity = Init.GetIdentity;	
	let CoaData = Init.GetCoa;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, CoaData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, CoaData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, CoaData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, CoaData);
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
