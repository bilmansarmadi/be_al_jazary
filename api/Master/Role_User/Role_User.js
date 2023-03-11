var express 	= require('express');
var middleware = require('../../assets/nox');
var router 		= express.Router();

var create 		= require('./C_Role_User.js');
var read 		= require('./R_Role_User.js');
var update 		= require('./U_Role_User.js');
var discard 	= require('./D_Role_User.js');

const Program = 'Role_User';

var Data = {
	Status	: 1000
};

class Role_User {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_role_user'
	};
	
	#tableColumn	= {
		tableColumn : {
			role_id: {name: 'role_id', datatype: 'varchar', length: 0, isNotNull: true, defaultvalue: null, value: null},
			role_nama: {name: 'role_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null}
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
		
		this.#tableColumn.tableColumn.role_id.value = middleware.Decrypt(value.body.role_id);
		this.#tableColumn.tableColumn.role_nama.value = middleware.Decrypt(value.body.role_nama);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Role_User();
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
