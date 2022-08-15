var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Bank_Account.js');
var read 		= require('./R_Bank_Account.js');
var update 		= require('./U_Bank_Account.js');
var discard 	= require('./D_Bank_Account.js');

const Program = 'Bank_Account';

var Data = {
	Status: 1000
};

class Bank_Account {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'bank_account'
	};
	
	#tableColumn = {
		tableColumn: {
			account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null},
			bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null},
			currency_id: {name: 'currency_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			coa_code: {name: 'coa_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
			account_name: {name: 'account_name', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			account_type: {name: 'account_type', datatype: 'varchar', length: 1, isNotNull: true, defaultvalue: null, value: null},
			current_balance: {name: 'current_balance', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: 0, value: null},
			prev_balance: {name: 'prev_balance', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: 0, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},
			account_number_old: {name: "account_number_old", datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetBankAccount() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetBankAccount(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
		this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
		this.#tableColumn.tableColumn.currency_id.value = middleware.Decrypt(value.body.currency_id);
		this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
		this.#tableColumn.tableColumn.coa_code.value = middleware.Decrypt(value.body.coa_code);
		this.#tableColumn.tableColumn.account_name.value = middleware.Decrypt(value.body.account_name);
		this.#tableColumn.tableColumn.account_type.value = middleware.Decrypt(value.body.account_type);
		this.#tableColumn.tableColumn.current_balance.value = middleware.Decrypt(value.body.current_balance);
		this.#tableColumn.tableColumn.prev_balance.value = middleware.Decrypt(value.body.prev_balance);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
		this.#tableColumn.tableColumn.account_number_old.value = middleware.Decrypt(value.body.account_number_old);
	}
}

router.post('/', function(req, res) {
	let Init = new Bank_Account();
	Init.SetBankAccount = req;
	
	let Identity= Init.GetIdentity;	
	let BankAccountData = Init.GetBankAccount;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, BankAccountData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, BankAccountData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, BankAccountData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, BankAccountData);
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
