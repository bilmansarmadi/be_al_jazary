var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Journal.js');
var read        = require('./R_Journal.js');
var update      = require('./U_Journal.js');
var discard     = require('./D_Journal.js');

const Program = 'Journal';

var Data = {
    Status: 1000
};

class Journal {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'journal'
    };

    #tableColumn = {
        tableColumn: {
            journal_code: {name: 'journal_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            period_code: {name: 'period_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            journal_date: {name: 'journal_date', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            num_entries: {name: 'num_entries', datatype: 'int', length: 0, isNotNull: true, defaultvalue: null, value: null},
            debit_amount: {name: 'debit_amount', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: null, value: null},
            credit_amount: {name: 'credit_amount', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: null, value: null},
            gl_status: {name: 'gl_status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 0, value: null},
            gl_source: {name: 'gl_source', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            reference: {name: 'reference', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            posted_by: {name: 'posted_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_posted: {name: 'date_posted', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null},

            journal_detail: {name: 'journal_detail', datatype: 'varchar', length: '225', isNotNull: true, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetJournal() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetJournal(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.journal_code.value = middleware.Decrypt(value.body.journal_code);
        this.#tableColumn.tableColumn.period_code.value = middleware.Decrypt(value.body.period_code);
        this.#tableColumn.tableColumn.journal_date.value = middleware.Decrypt(value.body.journal_date);
        this.#tableColumn.tableColumn.num_entries.value = middleware.Decrypt(value.body.num_entries);
        this.#tableColumn.tableColumn.debit_amount.value = middleware.Decrypt(value.body.debit_amount);
        this.#tableColumn.tableColumn.credit_amount.value = middleware.Decrypt(value.body.credit_amount);
        this.#tableColumn.tableColumn.gl_status.value = middleware.Decrypt(value.body.gl_status);
        this.#tableColumn.tableColumn.gl_source.value = middleware.Decrypt(value.body.gl_source);
        this.#tableColumn.tableColumn.reference.value = middleware.Decrypt(value.body.reference);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.posted_by.value = middleware.Decrypt(value.body.posted_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.date_posted.value = middleware.Decrypt(value.body.date_posted);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);

        this.#tableColumn.tableColumn.journal_detail.value = middleware.Decrypt(value.body.journal_detail);
    }
}

router.post('/', function(req, res) {
    let Init = new Journal();
    Init.SetJournal = req;

    let Identity = Init.GetIdentity;
    let JournalData = Init.GetJournal;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, JournalData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, JournalData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, JournalData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, JournalData);
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