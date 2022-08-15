var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Bank.js');
var read 		= require('./R_Bank.js');
var update 		= require('./U_Bank.js');
var discard 	= require('./D_Bank.js');

const Program = 'Bank';

var Data = {
	Status: 1000
};

class Bank {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'bank'
	};
	
	#tableColumn = {
		tableColumn: {
			bank_name: {name: 'bank_name', datatype: 'varchar', length: 30, isNotNull: true, defaultvalue: null, value: null},
			bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},
			bank_code_old: {name: 'bank_code_old', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetBank() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetBank(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.bank_name.value = middleware.Decrypt(value.body.bank_name);
		this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
		this.#tableColumn.tableColumn.bank_code_old.value = middleware.Decrypt(value.body.bank_code_old);
	}
}

router.post('/', function(req, res) {
	let Init = new Bank();
	Init.SetBank = req;
	
	let Identity = Init.GetIdentity;	
	let BankData = Init.GetBank;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, BankData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, BankData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, BankData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, BankData);
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
