var express         = require('express');
var middleware      = require('nox');
var multer  	    = require('multer')
var mimeType	    = require('mime-types');
var router          = express.Router();

var ext 			= '';
var uniqueSuffix 	= '';

var storage = multer.diskStorage({
	filename: (req, file, cb) => {
		ext = mimeType.extension(file.mimetype)
	  	uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	 	cb(null, uniqueSuffix +"."+ext)
	},
	destination: (req, file, cb) => {
	  	cb(null, 'public/images/bank-transaction')
	}
})

var upload = multer({ storage: storage, fileFilter: ImageFilter, limits:{ fieldSize: 10485760 } })

var create          = require('./C_Bank_Transaction.js');
var read            = require('./R_Bank_Transaction.js');
var update          = require('./U_Bank_Transaction.js');
var discard         = require('./D_Bank_Transaction.js');

const Program       = 'Bank_Transaction';

var Data = {
    Status: 1000
};

class Bank_Transaction {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'bank_transaction',
		Program		    : Program
    };

    #tableColumn = {
        tableColumn: {
            bank_transaction_id: {name: 'bank_transaction_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            no_voucher: {name: 'no_voucher', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
            workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            guarantee_id: {name: 'guarantee_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            bank_code: {name: 'bank_code', datatype: 'varchar', length: 10, isNotNull: false, defaultvalue: null, value: null},
            account_number: {name: 'account_number', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null},
            cheque_number: {name: 'cheque_number', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            tax_invoice_number: {name: 'tax_invoice_number', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            invoice_number: {name: 'invoice_number', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            street_mail_number: {name: 'street_mail_number', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
            bank_transaction_desc: {name: 'bank_transaction_desc', datatype: 'varchar', length: 255,isNotNull: false, defaultvalue: '', value: null},
            bank_transaction_date: {name: 'bank_transaction_date', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            bank_transaction_permission: {name: 'bank_transaction_permission', datatype: 'varchar', length: 5, isNotNull: true, defaultvalue: '', value: null},
            bank_transaction_type: {name: 'bank_transaction_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            transaction_type: {name: 'transaction_type', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            payment_accepted: {name: 'payment_accepted', datatype: 'varchar', length: 5, isNotNull: false, defaultvalue: '', value: null},
            amount: {name: 'amount', datatype: 'decimal', length: 18.2, isNotNull: true, defaultvalue: null, value: null},
			path_image: {name: 'path_image', datatype: 'varchar', length: 1000, isNotNull: true, defaultvalue: '', value: null},
            approval_by: {name: 'approval_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            posted_by: {name: 'posted_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
            date_approval: {name: 'date_approval', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: true, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
            date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_posted: {name: 'date_posted', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_receipt: {name: 'date_receipt', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_published: {name: 'date_published', datatype: 'date', length: 0, isNotNull: false, defaultvalue: null, value: null},
            date_end: {name: 'date_end', datatype: 'date', length: 0, isNotNull: false, defaultvalue: null, value: null},
            status_receipt: {name: 'status_receipt', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            status_escrow_accepted: {name: 'status_escrow_accepted',datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            approval_status: {name: 'approval_status', datatype: 'tinyint', length: 1, isNotNull: false, defaultvalue: 0, value: null},
            post_status: {name: 'post_status', datatype: 'tinyint', length: 0, isNotNull: false, defaultvalue: 0, value: null},
            status: {name: 'status', datatype: 'tinyint', length: 0, isNotNull: false, defaultvalue: 1, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetBankTransaction() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetBankTransaction(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.bank_transaction_id.value = middleware.Decrypt(value.body.bank_transaction_id);
        this.#tableColumn.tableColumn.no_voucher.value = middleware.Decrypt(value.body.no_voucher);
        this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
        this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
        this.#tableColumn.tableColumn.guarantee_id.value = middleware.Decrypt(value.body.guarantee_id);
        this.#tableColumn.tableColumn.bank_code.value = middleware.Decrypt(value.body.bank_code);
        this.#tableColumn.tableColumn.account_number.value = middleware.Decrypt(value.body.account_number);
        this.#tableColumn.tableColumn.cheque_number.value = middleware.Decrypt(value.body.cheque_number);
        this.#tableColumn.tableColumn.tax_invoice_number.value = middleware.Decrypt(value.body.tax_invoice_number);
        this.#tableColumn.tableColumn.invoice_number.value = middleware.Decrypt(value.body.invoice_number);
        this.#tableColumn.tableColumn.street_mail_number.value = middleware.Decrypt(value.body.street_mail_number);
        this.#tableColumn.tableColumn.bank_transaction_desc.value = middleware.Decrypt(value.body.bank_transaction_desc);
        this.#tableColumn.tableColumn.bank_transaction_date.value = middleware.Decrypt(value.body.bank_transaction_date);
        this.#tableColumn.tableColumn.bank_transaction_permission.value = middleware.Decrypt(value.body.bank_transaction_permission);
        this.#tableColumn.tableColumn.bank_transaction_type.value = middleware.Decrypt(value.body.bank_transaction_type);
        this.#tableColumn.tableColumn.transaction_type.value = middleware.Decrypt(value.body.transaction_type);
        this.#tableColumn.tableColumn.payment_accepted.value = middleware.Decrypt(value.body.payment_accepted);
        this.#tableColumn.tableColumn.amount.value = middleware.Decrypt(value.body.amount);
        this.#tableColumn.tableColumn.path_image.value = (middleware.Decrypt(value.body.path_image) != '') ? middleware.Decrypt(value.body.path_image.slice(-27)) : uniqueSuffix+"."+ext;
        this.#tableColumn.tableColumn.approval_by.value = middleware.Decrypt(value.body.approval_by);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.posted_by.value = middleware.Decrypt(value.body.posted_by);
        this.#tableColumn.tableColumn.date_approval.value = middleware.Decrypt(value.body.date_approval);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.date_posted.value = middleware.Decrypt(value.body.date_posted);
        this.#tableColumn.tableColumn.date_receipt.value = middleware.Decrypt(value.body.date_receipt);
        this.#tableColumn.tableColumn.date_published.value = middleware.Decrypt(value.body.date_published);
        this.#tableColumn.tableColumn.date_end.value = middleware.Decrypt(value.body.date_end);
        this.#tableColumn.tableColumn.status_receipt.value = middleware.Decrypt(value.body.status_receipt);
        this.#tableColumn.tableColumn.status_escrow_accepted.value = middleware.Decrypt(value.body.status_escrow_accepted);
        this.#tableColumn.tableColumn.approval_status.value = middleware.Decrypt(value.body.approval_status);
        this.#tableColumn.tableColumn.post_status.value = middleware.Decrypt(value.body.post_status);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
    }
}

router.post('/', upload.single('path_image'), function (req, res) {
    let Init = new Bank_Transaction();
    Init.SetBankTransaction = req;

    let Identity = Init.GetIdentity;
    let BankTransactionData = Init.GetBankTransaction;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, BankTransactionData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, BankTransactionData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, BankTransactionData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, BankTransactionData);
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