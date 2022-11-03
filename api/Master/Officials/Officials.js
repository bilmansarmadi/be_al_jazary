var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Officials.js');
var read        = require('./R_Officials.js');
var update      = require('./U_Officials.js');
var discard     = require('./D_Officials.js');

const Program   = 'Officials';

var Data = {
    Status: 1000
};

class Officials {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'officials'
    };

    #tableColumn = {
        tableColumn: {
            official_id: {name: 'official_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            submission_number: {name: 'submission_number', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            work_unit_id: {name: 'work_unit_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            position_id: {name: 'position_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            position_name: {name: 'position_name', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: '', value: null},
            official_name: {name: 'official_name', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
            official_rank: {name: 'official_rank', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
            amount_submission: {name: 'amount_submission', datatype: 'decimal', length: 50.5, isNotNull: false, defaultvalue: null, value: null},
            amount_checking: {name: 'amount_checking', datatype: 'decimal', length: 50.5, isNotNull: false, defaultvalue: null, value: null},
            amount_approval: {name: 'amount_approval', datatype: 'decimal', length: 50.5, isNotNull: false, defaultvalue: null, value: null},
            paid_status: {name: 'paid_status', datatype: 'tinyint', length: 1, isNotNull: true, defaultvalue: 0, value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 15, isNotNull: true, defaultvalue: '', value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 15, isNotNull: false, defaultvalue: '', value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            status_submission: {name: 'status_submission', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status_checking: {name: 'status_checking', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status_approval: {name: 'status_approval', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status: {name: 'status', datatype: 'tinyint', length: 1, isNotNull: true, defaultvalue: 1, value: null},

            amount_range_from: {name: 'amount_range_from', datatype: 'decimal', length: 100, isNotNull: true, defaultvalue: 0, value: null},
            amount_range_to: {name: 'amount_range_to', datatype: 'decimal', length: 100, isNotNull: true, defaultvalue: 0, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            submission_permission: {name: 'submission_permission', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetOfficials() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetOfficials(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.official_id.value = middleware.Decrypt(value.body.official_id);
        this.#tableColumn.tableColumn.submission_number.value = middleware.Decrypt(value.body.submission_number);
        this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
        this.#tableColumn.tableColumn.work_unit_id.value = middleware.Decrypt(value.body.work_unit_id);
        this.#tableColumn.tableColumn.position_id.value = middleware.Decrypt(value.body.position_id);
        this.#tableColumn.tableColumn.position_name.value = middleware.Decrypt(value.body.position_name);
        this.#tableColumn.tableColumn.official_name.value = middleware.Decrypt(value.body.official_name);
        this.#tableColumn.tableColumn.official_rank.value = middleware.Decrypt(value.body.official_rank);
        this.#tableColumn.tableColumn.amount_submission.value = middleware.Decrypt(value.body.amount_submission);
        this.#tableColumn.tableColumn.amount_checking.value = middleware.Decrypt(value.body.amount_checking);
        this.#tableColumn.tableColumn.amount_approval.value = middleware.Decrypt(value.body.amount_approval);
        this.#tableColumn.tableColumn.paid_status.value = middleware.Decrypt(value.body.paid_status);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.status_submission.value = middleware.Decrypt(value.body.status_submission);
        this.#tableColumn.tableColumn.status_checking.value = middleware.Decrypt(value.body.status_checking);
        this.#tableColumn.tableColumn.status_approval.value = middleware.Decrypt(value.body.status_approval);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);

        this.#tableColumn.tableColumn.amount_range_from.value = middleware.Decrypt(value.body.amount_range_from);
        this.#tableColumn.tableColumn.amount_range_to.value = middleware.Decrypt(value.body.amount_range_to);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.submission_permission.value = middleware.Decrypt(value.body.submission_permission);
    }
}

router.post('/', function(req, res) {
    let Init = new Officials();
    Init.SetOfficials = req;

    let Identity = Init.GetIdentity;
    let OfficialsData = Init.GetOfficials;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, OfficialsData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, OfficialsData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, OfficialsData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, OfficialsData);
        } else {
            if (middleware.TriggerValidate(Identity.Trigger) && middleware.Permission(Identity) == false) {
                Data.Status = 3002;
                middleware.Response(res, Data);
            } else {
                Data.Status =3000;
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