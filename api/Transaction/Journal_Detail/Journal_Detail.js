var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Journal_Detail.js');
var read        = require('./R_Journal_Detail.js');
var update      = require('./U_Journal_Detail.js');
var discard     = require('./D_Journal_Detail.js');

const Program = 'Journal_Detail';

var Data = {
    Status: 1000
};

class Journal_Detail {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'journal_detail'
    };

    #tableColumn = {
        tableColumn: {
            journal_code: {name: 'journal_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            journal_line: {name: 'journal_line', datatype: 'int', length: 0, isNotNull: true, defaultvalue: null, value: null},
            coa_code: {name: 'coa_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            description: {name: 'description', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: null, value: null},
            position: {name: 'position', datatype: 'varchar', length: 1, isNotNull: true, defaultvalue: null, value: null},
            reference: {name: 'reference', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetJournalDetail() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetCashbankDetail(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.journal_code.value = middleware.Decrypt(value.body.journal_code);
        this.#tableColumn.tableColumn.journal_line.value = middleware.Decrypt(value.body.journal_line);
        this.#tableColumn.tableColumn.coa_code.value = middleware.Decrypt(value.body.coa_code);
        this.#tableColumn.tableColumn.description.value = middleware.Decrypt(value.body.description);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.position.value = middleware.Decrypt(value.body.position);
        this.#tableColumn.tableColumn.reference.value = middleware.Decrypt(value.body.reference);
    }
}

router.post('/', function(req, res) {
    let Init = new Journal_Detail();
    Init.SetCashbankDetail = req;

    let Identity = Init.GetIdentity;
    let JournalDetailData = Init.GetJournalDetail;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, JournalDetailData);
        } else if (middleware.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, JournalDetailData);
        } else if (middleware.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, JournalDetailData);
        } else if (middleware.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, JournalDetailData);
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