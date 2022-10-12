var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Currency.js');
var read 		= require('./R_Currency.js');
var update 		= require('./U_Currency.js');
var discard 	= require('./D_Currency.js');

const Program = 'Currency';

var Data = {
	Status: 1000
};

class Currency {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'currency'
	};
	
	#tableColumn = {
		tableColumn: {
			currency_id: {name: 'currency_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			currency_name: {name: 'currency_name', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			local_currency: {name: 'local_currency', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 0, value: null},
			
			currency_id_old: {name: 'currency_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetCurrency() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetCurrency(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.currency_id.value = middleware.Decrypt(value.body.currency_id);
		this.#tableColumn.tableColumn.currency_name.value = middleware.Decrypt(value.body.currency_name);
		this.#tableColumn.tableColumn.local_currency.value = middleware.Decrypt(value.body.local_currency);

		this.#tableColumn.tableColumn.currency_id_old.value = middleware.Decrypt(value.body.currency_id_old);
	}
}

router.post('/', function(req, res) {
	let Init = new Currency();
	Init.SetCurrency = req;
	
	let Identity = Init.GetIdentity;	
	let CurrencyData = Init.GetCurrency;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, CurrencyData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, CurrencyData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, CurrencyData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, CurrencyData);
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
