var express     = require('express');
var middleware  = require('nox');
var router      = express.Router();

var create      = require('./C_Positions.js');
var read        = require('./R_Positions.js');
var update      = require('./U_Positions.js');
var discard     = require('./D_Positions.js');

const Program   = 'Positions';

var Data = {
    Status: 1000
};

class Positions {
    #Identity = {
        UID             : '',
        Token           : '',
        Trigger         : '',
        Route           : '',
        IsNeedReturn    : false,
        TableName       : 'positions'
    };

    #tableColumn = {
        tableColumn: {
            position_id: {name: 'position_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            organizational_unit_id: {name: 'organizational_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            sub_organizational_unit: {name: 'sub_organizational_unit', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            work_unit_id: {name: 'work_unit_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
            position_name: {name: 'position_name', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: '', value: null},
            official_name: {name: 'official_name', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
            created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: '', value: null},
            modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'tinyint', length: 0, isNotNull: true, defaultvalue: 1, value: null}
        }
    }

    get GetIdentity() {
        return this.#Identity;
    }

    get GetPositions() {
        let Obj = {
            ...this.#Identity,
            ...this.#tableColumn
        };

        return Obj;
    }

    set SetPositions(value) {
        this.#Identity.UID      = middleware.Decrypt(value.body.UID);
        this.#Identity.Token    = middleware.Decrypt(value.body.Token);
        this.#Identity.Trigger  = middleware.Decrypt(value.body.Trigger);
        this.#Identity.Route    = middleware.Decrypt(value.body.Route);

        this.#tableColumn.tableColumn.position_id.value = middleware.Decrypt(value.body.position_id);
        this.#tableColumn.tableColumn.organizational_unit_id.value = middleware.Decrypt(value.body.organizational_unit_id);
        this.#tableColumn.tableColumn.sub_organizational_unit.value = middleware.Decrypt(value.body.sub_organizational_unit);
        this.#tableColumn.tableColumn.work_unit_id.value = middleware.Decrypt(value.body.work_unit_id);
        this.#tableColumn.tableColumn.position_name.value = middleware.Decrypt(value.body.position_name);
        this.#tableColumn.tableColumn.official_name.value = middleware.Decrypt(value.body.official_name);
        this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
        this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
        this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
        this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
        this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
    }
}

router.post('/', function(req, res) {
    let Init = new Positions();
    Init.SetPositions = req;

    let Identity = Init.GetIdentity;
    let PositionsData = Init.GetPositions;

    ResetData();

    if (middleware.TokenValidate(Identity.Token)) {
        if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
            create.Create(res, PositionsData);
        } else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
            read.Read(res, PositionsData);
        } else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
            update.Update(res, PositionsData);
        } else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
            discard.Discard(res, PositionsData);
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