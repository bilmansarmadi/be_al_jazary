var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Submission_Form.js');
var read        = require('./R_Submission_Form.js');
var update      = require('./U_Submission_Form.js');
var discard     = require('./D_Submission_Form.js');

const Program   = 'Submission_Form';

var Data = {
    Status: 1000
};

class Submission_Form {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'submission_form'
    };

    #tableColumn = {
        tableColumn: {
            submission_number: {name: 'submission_number', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            work_unit_id: {name: 'work_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            submission_date: {name: 'submission_date', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: null, value: null},
            submission_desc: {name: 'submission_desc', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: null, value: null},
            submission_type: {name: 'submission_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            submission_permission: {name: 'submission_permission', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            transaction_type: {name: 'transaction_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 50.0, isNotNull: true, defaultvalue: null, value: null},
            checking_by: {name: 'checking_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            approval_by: {name: 'approval_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_checking: {name: 'date_checking', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_approval: {name: 'date_approval', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_modified: {name:'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            checking_status: {name: 'checking_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            approval_status: {name: 'approval_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            allocation_status: {name: 'allocation_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status: {name: 'status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 1, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetSubmissionForm() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetSubmissionForm(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.submission_number.value = middleware.Decrypt(value.body.submission_number);
        this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
        this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
        this.#tableColumn.tableColumn.work_unit_id.value = middleware.Decrypt(value.body.work_unit_id);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.submission_date.value = middleware.Decrypt(value.body.submission_date);
        this.#tableColumn.tableColumn.submission_desc.value = middleware.Decrypt(value.body.submission_desc);
        this.#tableColumn.tableColumn.submission_type.value = middleware.Decrypt(value.body.submission_type);
        this.#tableColumn.tableColumn.submission_permission.value = middleware.Decrypt(value.body.submission_permission);
        this.#tableColumn.tableColumn.transaction_type.value = middleware.Decrypt(value.body.transaction_type);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.checking_by.value = middleware.Decrypt(value.body.checking_by);
        this.#tableColumn.tableColumn.approval_by.value = middleware.Decrypt(value.body.approval_by);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_checking.value = middleware.Decrypt(value.body.date_checking);
        this.#tableColumn.tableColumn.date_approval.value = middleware.Decrypt(value.body.date_approval);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.checking_status.value = middleware.Decrypt(value.body.checking_status);
        this.#tableColumn.tableColumn.approval_status.value = middleware.Decrypt(value.body.approval_status);
        this.#tableColumn.tableColumn.allocation_status.value = middleware.Decrypt(value.body.allocation_status);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
    }
}

router.post('/', function(req, res) {
    let Init = new Submission_Form();
    Init.SetSubmissionForm = req;

    let Identity = Init.GetIdentity;
    let SubmissionFormData = Init.GetSubmissionForm;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, SubmissionFormData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, SubmissionFormData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, SubmissionFormData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, SubmissionFormData);
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