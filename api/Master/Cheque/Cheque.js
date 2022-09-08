var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Cheque.js');
var read        = require('./R_Cheque.js');
var update      = require('./U_Cheque.js');
var discard     = require('./D_Cheque.js');

const Program = 'Cheque';

var Data = {
    Status: 1000
};

class Cheque {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'cheque'
    };

    #tableColumn = {
        tableColumn: {
            cheque_number: {name: 'cheque_number', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: null, value: null},
            account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null},
            date: {name: 'date', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 50.0, isNotNull: true, defaultvalue: null, value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            status: {name: 'status', datatype: 'tinyint', length: 1, isNotNull: true, defaultvalue: 1, value: null},
            cheque_number_old: {name: 'cheque_number_old', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetCheque() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetCheque(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.cheque_number.value = middleware.Decrypt(value.body.cheque_number);
        this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
        this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
        this.#tableColumn.tableColumn.date.value = middleware.Decrypt(value.body.date);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
        this.#tableColumn.tableColumn.cheque_number_old.value = middleware.Decrypt(value.body.cheque_number_old);
    }
}

router.post('/', function(req, res) {
    let Init = new Cheque();
    Init.SetCheque = req;

    let Identity = Init.GetIdentity;
    let ChequeData = Init.GetCheque;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, ChequeData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, ChequeData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, ChequeData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, ChequeData);
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