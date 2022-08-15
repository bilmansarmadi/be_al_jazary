var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Exchange_Rate.js');
var read 		= require('./R_Exchange_Rate.js');
var update 		= require('./U_Exchange_Rate.js');
var discard 	= require('./D_Exchange_Rate.js');

const Program = 'Exchange_Rate';

var Data = {
	Status: 1000
};

class Exchange_Rate {
	#Identity = {
		UID 			: '',
		Token			: '',
		Trigger			: '',
		Route			: '',
		IsNeedReturn	: false,
		TableName		: 'exchange_rate'
	};
	
	#tableColumn = {
		tableColumn: {
			rate_id: {name: 'rate_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			currency_id: {name: 'currency_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			rate_date: {name: 'rate_date', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			rate_amount: {name: 'rate_amount', datatype: 'decimal', length: 18.2, isNotNull: true, defaultvalue: 0.00, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetExchangeRate() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetExchangeRate(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.rate_id.value = middleware.Decrypt(value.body.rate_id);
		this.#tableColumn.tableColumn.currency_id.value = middleware.Decrypt(value.body.currency_id);
		this.#tableColumn.tableColumn.rate_date.value = middleware.Decrypt(value.body.rate_date);
		this.#tableColumn.tableColumn.rate_amount.value = middleware.Decrypt(value.body.rate_amount);
	}
}

router.post('/', function(req, res) {
	let Init = new Exchange_Rate();
	Init.SetExchangeRate = req;
	
	let Identity = Init.GetIdentity;	
	let ExchangeRateData = Init.GetExchangeRate;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, ExchangeRateData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, ExchangeRateData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, ExchangeRateData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, ExchangeRateData);
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
