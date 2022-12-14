var express     = require('express');
var middleware  = require('nox');
var multer      = require('multer');
var mimeType    = require('mime-types');
var router      = express.Router();

var ext 			            = '';
var extBankGuarantee            = '';
var uniqueSuffix 	            = '';
var uniqueSuffixBankGuarantee   = '';

var storage = multer.diskStorage({
	filename: (req, file, cb) => {
	  	if (req.body.destination == 'bank-guarantee') {
            extBankGuarantee = mimeType.extension(file.mimetype)
            uniqueSuffixBankGuarantee = Date.now() + '-' + Math.round(Math.random() * 1E9)
	 	    cb(null, uniqueSuffixBankGuarantee +"."+extBankGuarantee)
        } else {
            ext = mimeType.extension(file.mimetype)
            uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	 	    cb(null, uniqueSuffix +"."+ext)
        }
	},

	destination: (req, file, cb) => {
	  	if (req.body.destination == 'bank-guarantee') {
            cb(null, 'public/images/bank-guarantee');
        } else {
            cb(null, 'public/images/submission-form');
        }
	}
})

var upload = multer({ storage: storage, fileFilter: ImageFilter, limits:{ fieldSize: 10485760 } })

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
            workgroup_partner_id: {name: 'workgroup_partner_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            sub_organizational_unit: {name: 'sub_organizational_unit', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            work_unit_id: {name: 'work_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            position_id: {name: 'position_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            activity_id: {name: 'activity_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: false, defaultvalue: null, value: null},
            account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: null, value: null},
            guarantee_id: {name: 'guarantee_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            submission_desc: {name: 'submission_desc', datatype: 'varchar', length: 100, isNotNull: false, defaultvalue: null, value: null},
            submission_type: {name: 'submission_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            submission_permission: {name: 'submission_permission', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            submission_financing: {name: 'submission_financing', datatype: 'decimal', length: 10, isNotNull: false, defaultvalue: null, value: null},
            transaction_type: {name: 'transaction_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
            payment_status: {name: 'payment_status', datatype: 'varchar', length: '100', isNotNull: true, defaultvalue: '', value: null},
            money_status: {name: 'money_status', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            submission_status: {name: 'submission_status', datatype: 'varchar', length: 15, isNotNull: false, defaultvalue: '', value: null},
            path_image_project: {name: 'path_image_project', datatype: 'varchar', length: 1000, isNotNull: false, defaultvalue: '', value: null},
            path_image_bank_guarantee: {name: 'path_image_bank_guarantee', datatype: 'varchar', length: 1000, isNotNull: false, defaultvalue: '', value: null},
            checking_by: {name: 'checking_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            approval_by: {name: 'approval_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            posted_by: {name: 'posted_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_submission: {name: 'date_submission', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: null, value: null},
            date_posted: {name: 'date_posted', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_checking: {name: 'date_checking', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_approval: {name: 'date_approval', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_modified: {name:'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_published: {name: 'date_published', datatype: 'date', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_end: {name: 'date_end', datatype: 'date', length: 0, isNotNull: false, defaultvalue: null, value: null},
            upload_status: {name: 'upload_status', datatype: 'tinyint', length: 0, isNotNull: false, defaultvalue: 0, value: null},
            post_status: {name: 'post_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            checking_status: {name: 'checking_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            approval_status: {name: 'approval_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            allocation_status: {name: 'allocation_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status_cashing: {name: 'status_cashing', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: '0', value: null},
            status: {name: 'status', datatype: 'tinyint', length: 1, isNotNull: true, defaultvalue: 1, value: null}
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
        this.#tableColumn.tableColumn.workgroup_partner_id.value = middleware.Decrypt(value.body.workgroup_partner_id);
        this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
        this.#tableColumn.tableColumn.sub_organizational_unit.value = middleware.Decrypt(value.body.sub_organizational_unit);
        this.#tableColumn.tableColumn.work_unit_id.value = middleware.Decrypt(value.body.work_unit_id);
        this.#tableColumn.tableColumn.position_id.value = middleware.Decrypt(value.body.position_id);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.activity_id.value = middleware.Decrypt(value.body.activity_id);
        this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
        this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
        this.#tableColumn.tableColumn.guarantee_id.value = middleware.Decrypt(value.body.guarantee_id);
        this.#tableColumn.tableColumn.submission_desc.value = middleware.Decrypt(value.body.submission_desc);
        this.#tableColumn.tableColumn.submission_type.value = middleware.Decrypt(value.body.submission_type);
        this.#tableColumn.tableColumn.submission_permission.value = middleware.Decrypt(value.body.submission_permission);
        this.#tableColumn.tableColumn.submission_financing.value = middleware.Decrypt(value.body.submission_financing);
        this.#tableColumn.tableColumn.transaction_type.value = middleware.Decrypt(value.body.transaction_type);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.payment_status.value = middleware.Decrypt(value.body.payment_status);
        this.#tableColumn.tableColumn.money_status.value = middleware.Decrypt(value.body.money_status);
        this.#tableColumn.tableColumn.submission_status.value = middleware.Decrypt(value.body.submission_status);
        this.#tableColumn.tableColumn.path_image_project.value = (middleware.Decrypt(value.body.path_image_project) != '') ? middleware.Decrypt(value.body.path_image_project.substr(50)) : uniqueSuffix+"."+ext;
        this.#tableColumn.tableColumn.path_image_bank_guarantee.value = (middleware.Decrypt(value.body.path_image_bank_guarantee) != '') ? middleware.Decrypt(value.body.path_image_bank_guarantee.substr(49)) : uniqueSuffixBankGuarantee+"."+extBankGuarantee;
        this.#tableColumn.tableColumn.checking_by.value = middleware.Decrypt(value.body.checking_by);
        this.#tableColumn.tableColumn.approval_by.value = middleware.Decrypt(value.body.approval_by);
        this.#tableColumn.tableColumn.posted_by.value = middleware.Decrypt(value.body.posted_by);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_submission.value = middleware.Decrypt(value.body.date_submission);
        this.#tableColumn.tableColumn.date_posted.value = middleware.Decrypt(value.body.date_posted);
        this.#tableColumn.tableColumn.date_checking.value = middleware.Decrypt(value.body.date_checking);
        this.#tableColumn.tableColumn.date_approval.value = middleware.Decrypt(value.body.date_approval);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.date_published.value = middleware.Decrypt(value.body.date_published);
        this.#tableColumn.tableColumn.date_end.value = middleware.Decrypt(value.body.date_end);
        this.#tableColumn.tableColumn.upload_status.value = middleware.Decrypt(value.body.upload_status);
        this.#tableColumn.tableColumn.post_status.value = middleware.Decrypt(value.body.post_status);
        this.#tableColumn.tableColumn.checking_status.value = middleware.Decrypt(value.body.checking_status);
        this.#tableColumn.tableColumn.approval_status.value = middleware.Decrypt(value.body.approval_status);
        this.#tableColumn.tableColumn.allocation_status.value = middleware.Decrypt(value.body.allocation_status);
        this.#tableColumn.tableColumn.status_cashing.value = middleware.Decrypt(value.body.status_cashing);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
    }
}

router.post('/', upload.fields([{ name: 'path_image_project', maxCount: 1 }, { name: 'path_image_bank_guarantee', maxCount: 1 }]), function(req, res) {
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

function ImageFilter(req, file, cb) {
	if (!file.originalname.match(/\.(png|jpeg|jpg|gif)/)) {
	  cb(new Error('Only images are allowed'), false) // setting the second param
	}
	cb(null, true)
}

module.exports = router;