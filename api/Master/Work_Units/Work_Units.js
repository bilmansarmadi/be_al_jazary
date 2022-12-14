var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Work_Units.js');
var read        = require('./R_Work_Units.js');
var update      = require('./U_Work_Units.js');
var discard     = require('./D_Work_Units.js');

const Program = 'Work_Units';

var Data = {
    Status: 1000
};

class Work_Units {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'work_units'
    };

    #tableColumn = {
        tableColumn: {
            work_unit_id: {name: 'work_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            sub_organizational_unit: {name: 'sub_organizational_unit', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            work_unit_name: {name: 'work_unit_name', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
            work_unit_group: {name: 'work_unit_group', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 15, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 15, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'tinyint', length: 0, isNotNull: true, defaultvalue: 1, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetWorkUnits() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetWorkUnits(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.work_unit_id.value = middleware.Decrypt(value.body.work_unit_id);
        this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
        this.#tableColumn.tableColumn.sub_organizational_unit.value = middleware.Decrypt(value.body.sub_organizational_unit);
        this.#tableColumn.tableColumn.work_unit_name.value = middleware.Decrypt(value.body.work_unit_name);
        this.#tableColumn.tableColumn.work_unit_group.value = middleware.Decrypt(value.body.work_unit_group);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
    }
}

router.post('/', function(req, res) {
    let Init = new Work_Units();
    Init.SetWorkUnits = req;

    let Identity = Init.GetIdentity;
    let WorkUnitsData = Init.GetWorkUnits;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity))  {
            create.Create(res, WorkUnitsData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, WorkUnitsData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, WorkUnitsData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, WorkUnitsData);
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