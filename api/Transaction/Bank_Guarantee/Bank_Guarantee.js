var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Bank_Guarantee.js');
var read 		= require('./R_Bank_Guarantee.js');
var update 		= require('./U_Bank_Guarantee.js');
var discard 	= require('./D_Bank_Guarantee.js');

const Program = 'Bank_Guarantee';

var Data = {
	Status: 1000
};

class Bank_Guarantee {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'bank_guarantee'
	};
	
	#tableColumn = {
		tableColumn: {
			guarantee_id: {name: 'guarantee_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			guarantee_address: {name: 'guarantee_address', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: '', value: null},
			guarantee_permission: {name: 'guarantee_permission', datatype: 'varchar', length: 5, isNotNull: true, defaultvalue: '', value: null},
			guarantee_type: {name: 'guarantee_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
			guarantee_date: {name: 'guarantee_date', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null},
			account_number: {name: 'account_number', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			total_amount: {name: 'total_amount', datatype: 'decimal', length: 18.2, isNotNull: true, defaultvalue: 0.00, value: null},
			total_paid: {name: 'total_paid', datatype: 'decimal', length: 18.2, isNotNull: false, defaultvalue: 0.00, value: null},
			total_received: {name: 'total_received', datatype: 'decimal', length: 18.2, isNotNull: false, defaultvalue: 0.00, value: null},
			date_published: {name: 'date_published', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			date_end: {name: 'date_end', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status_cashing: {name: 'status_cashing', datatype: 'int', length: 0, isNotNull: false, defaultvalue: 0, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},
			// guarantee_id_old: {name: 'guarantee_id_old', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetBankGuarantee() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetBankGuarantee(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.guarantee_id.value = middleware.Decrypt(value.body.guarantee_id);
		this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
		this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
		this.#tableColumn.tableColumn.guarantee_address.value = middleware.Decrypt(value.body.guarantee_address);
		this.#tableColumn.tableColumn.guarantee_permission.value = middleware.Decrypt(value.body.guarantee_permission);
		this.#tableColumn.tableColumn.guarantee_type.value = middleware.Decrypt(value.body.guarantee_type);
		this.#tableColumn.tableColumn.guarantee_date.value = middleware.Decrypt(value.body.guarantee_date);
		this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
		this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
		this.#tableColumn.tableColumn.total_amount.value = middleware.Decrypt(value.body.total_amount);
		this.#tableColumn.tableColumn.total_paid.value = middleware.Decrypt(value.body.total_paid);
		this.#tableColumn.tableColumn.total_received.value = middleware.Decrypt(value.body.total_received);
		this.#tableColumn.tableColumn.date_published.value = middleware.Decrypt(value.body.date_published);
		this.#tableColumn.tableColumn.date_end.value = middleware.Decrypt(value.body.date_end);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status_cashing.value = middleware.Decrypt(value.body.status_cashing);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
		// this.#tableColumn.tableColumn.guarantee_id_old.value = middleware.Decrypt(value.body.guarantee_id_old);
	}
}

router.post('/', function(req, res) {
	let Init = new Bank_Guarantee();
	Init.SetBankGuarantee = req;
	
	let Identity = Init.GetIdentity;	
	let BankGuaranteeData = Init.GetBankGuarantee;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, BankGuaranteeData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, BankGuaranteeData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, BankGuaranteeData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, BankGuaranteeData);
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
