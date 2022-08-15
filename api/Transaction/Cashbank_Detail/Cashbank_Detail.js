var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Cashbank_Detail.js');
var read        = require('./R_Cashbank_Detail.js');
var update      = require('./U_Cashbank_Detail.js');
var discard     = require('./D_Cashbank_Detail.js');

const Program = 'Cashbank_Detail';

var Data = {
    Status: 1000
};

class Cashbank_Detail {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'cashbank_detail'
    };

    #tableColumn = {
        tableColumn: {
            cashbank_id: {name: 'cashbank_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            guarantee_id: {name: 'guarantee_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            cashbank_line: {name: 'cashbank_line', datatype: 'int', length: 0, isNotNull: true, defaultvalue: null, value: null},
            coa_code: {name: 'coa_code', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            description: {name: 'description', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 18.2, isNotNull: true, defaultvalue: null, value: null},
            reference: {name: 'reference', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetCashbankDetail() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetCahbankDetail(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);
        
        this.#tableColumn.tableColumn.cashbank_id.value = middleware.Decrypt(value.body.cashbank_id);
        this.#tableColumn.tableColumn.guarantee_id.value = middleware.Decrypt(value.body.guarantee_id);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.cashbank_line.value = middleware.Decrypt(value.body.cashbank_line);
        this.#tableColumn.tableColumn.coa_code.value = middleware.Decrypt(value.body.coa_code);
        this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
        this.#tableColumn.tableColumn.description.value = middleware.Decrypt(value.body.description);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.reference.value = middleware.Decrypt(value.body.reference);
    }
}

router.post('/', function(req, res) {
    let Init = new Cashbank_Detail();
    Init.SetCahbankDetail = req;

    let Identity = Init.GetIdentity;
    let CashbankDetailData = Init.GetCashbankDetail;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, CashbankDetailData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, CashbankDetailData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, CashbankDetailData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, CashbankDetailData);
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