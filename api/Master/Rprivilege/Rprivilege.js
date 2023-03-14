var express     = require('../../../assets/express');
var middleware 	= require('../../../assets/nox');
var router 		= express.Router();

var create 		= require('./C_Rprivilege.js');
var read 		= require('./R_Rprivilege.js');
var update 		= require('./U_Rprivilege.js');
var discard 	= require('./D_Rprivilege.js');

const Program = 'Rprivilege';

var Data = {
	Status	: 1000
};

class Rprivilege {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_rprivilege'
	};
	
	#tableColumn	= {
		tableColumn : {
            rprivilege_id: {name: 'rprivilege_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null},
			role_id: {name: 'role_id', datatype: 'int', length: 11, isNotNull: true, defaultvalue: null, value: null},
			menu_id: {name: 'menu_id', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
            rprivilege_create: {name: 'rprivilege_create', datatype: 'tinyint', length: 6, isNotNull: true, defaultvalue: 0, value: null},
            rprivilege_read: {name: 'rprivilege_read', datatype: 'tinyint', length: 6, isNotNull: true, defaultvalue: 0, value: null},
            rprivilege_update: {name: 'rprivilege_update', datatype: 'tinyint', length: 6, isNotNull: true, defaultvalue: 0, value: null},
            rprivilege_delete: {name: 'rprivilege_delete', datatype: 'tinyint', length: 6, isNotNull: true, defaultvalue: 0, value: null}


        }
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetRoleUser() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetRoleUser (value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
        this.#tableColumn.tableColumn.rprivilege_id.value = middleware.Decrypt(value.body.rprivilege_id);
		this.#tableColumn.tableColumn.role_id.value = middleware.Decrypt(value.body.role_id);
		this.#tableColumn.tableColumn.menu_id.value = middleware.Decrypt(value.body.menu_id);
        this.#tableColumn.tableColumn.rprivilege_create.value = middleware.Decrypt(value.body.rprivilege_create);
        this.#tableColumn.tableColumn.rprivilege_read.value = middleware.Decrypt(value.body.rprivilege_read);
        this.#tableColumn.tableColumn.rprivilege_update.value = middleware.Decrypt(value.body.rprivilege_update);
        this.#tableColumn.tableColumn.rprivilege_delete.value = middleware.Decrypt(value.body.rprivilege_delete);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Rprivilege();
	Init.SetRoleUser  	= req;
	
	let Identity 	= Init.GetIdentity;	
	let RoleUserData 	= Init.GetRoleUser;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, RoleUserData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, RoleUserData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, RoleUserData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, RoleUserData);
		} else {
			if (middleware.TriggerValidate(Identity.Trigger) && middleware.Permission(Identity) == false) {
				Data.Status	= 3002;
				middleware.Response(res, Data);
			} else {
				Data.Status	= 3000;
				middleware.Response(res, Data);
			}
		}
	} else {
		Data.Status	= 3001;
		middleware.Response(res, Data);
	}
})

function ResetData() {
	Data.Status 	= 1000;
}

module.exports = router;
