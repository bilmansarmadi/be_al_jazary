var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Cashbank.js');
var read        = require('./R_Cashbank.js');
var update      = require('./U_Cashbank.js');
var discard     = require('./D_Cashbank.js');

const Program = 'Cashbank';

var Data = {
    Status: 1000
};

class Cashbank {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'cashbank'
    };

    #tableColumn = {
        tableColumn: {
            cashbank_id: {name: 'cashbank_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            period_code: {name: 'period_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            cashbank_desc: {name: 'cashbank_desc', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            cashbank_date: {name: 'cashbank_date', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            cashbank_type: {name: 'cashbank_type', datatype: 'varchar', length: 1, isNotNull: true, defaultvalue: null, value: null},
            reference: {name: 'reference', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            posted_by: {name: 'posted_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_posted: {name: 'date_posted', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            status: {name: 'status', datatype: 'int', length: 0, isNotNull: false, defaultvalue: '', value: null},
            
            guarantee_id: {name: 'guarantee_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            coa_code: {name: 'coa_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            description: {name: 'description', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 18.2, isNotNull: true, defaultvalue: null, value: null},
            cashbank_detail: {name: 'cashbank_detail', datatype: 'varchar', length: 225, isNotNull: true, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetCashbank() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetCashbank(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.cashbank_id.value = middleware.Decrypt(value.body.cashbank_id);
        this.#tableColumn.tableColumn.period_code.value = middleware.Decrypt(value.body.period_code);
        this.#tableColumn.tableColumn.cashbank_desc.value = middleware.Decrypt(value.body.cashbank_desc);
        this.#tableColumn.tableColumn.cashbank_date.value = middleware.Decrypt(value.body.cashbank_date);
        this.#tableColumn.tableColumn.cashbank_type.value = middleware.Decrypt(value.body.cashbank_type);
        this.#tableColumn.tableColumn.reference.value = middleware.Decrypt(value.body.reference);
        this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.posted_by.value = middleware.Decrypt(value.body.posted_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.date_posted.value = middleware.Decrypt(value.body.date_posted);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
        
        this.#tableColumn.tableColumn.guarantee_id.value = middleware.Decrypt(value.body.guarantee_id);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.coa_code.value = middleware.Decrypt(value.body.coa_code);
        this.#tableColumn.tableColumn.description.value = middleware.Decrypt(value.body.description);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.cashbank_detail.value = middleware.Decrypt(value.body.cashbank_detail);
    }
}

router.post('/', function(req, res) {
    let Init = new Cashbank();
    Init.SetCashbank  = req;

    let Identity = Init.GetIdentity;
    let CashbankData = Init.GetCashbank;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, CashbankData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, CashbankData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, CashbankData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, CashbankData);
        } else {
            if (middleware.TriggerValidate(Identity.Trigger) && middleware.Permission(Identity) == false) {
                Data.Status = 3002;
                middleware.Response(res, Data);
            } else {
                Data.Status = 3000;
                middleware.Response(res, Data);
            }
        }
    } else {
        Data.Status = 3001;
        middleware.Response(res, Data);
    }
})

function ResetData() {
    Data.Status = 1000;
}

module.exports = router;