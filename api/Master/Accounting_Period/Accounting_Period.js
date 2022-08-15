var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Accounting_Period.js');
var read 		= require('./R_Accounting_Period.js');
var update 		= require('./U_Accounting_Period.js');
var discard 	= require('./D_Accounting_Period.js');

const Program = 'Accounting_Period';

var Data = {
	Status: 1000
};

class Accounting_Period {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'accounting_period'
	};
	
	#tableColumn = {
		tableColumn: {
			period_code: {name: 'period_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			period_start: {name: 'period_start', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			period_end: {name: 'period_end', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetAccountingPeriod() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetAccountingPeriod(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.period_code.value = middleware.Decrypt(value.body.period_code);
		this.#tableColumn.tableColumn.period_start.value = middleware.Decrypt(value.body.period_start);
		this.#tableColumn.tableColumn.period_end.value = middleware.Decrypt(value.body.period_end);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init = new Accounting_Period();
	Init.SetAccountingPeriod = req;
	
	let Identity = Init.GetIdentity;	
	let AccountingPeriodData = Init.GetAccountingPeriod;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, AccountingPeriodData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, AccountingPeriodData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, AccountingPeriodData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, AccountingPeriodData);
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
