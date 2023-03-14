var express     = require('../../../assets/express');
var middleware 	= require('../../../assets/nox');
var router 		= express.Router();

var create 		= require('./C_Users.js');
var read 		= require('./R_Users.js');
var update 		= require('./U_Users.js');
var discard 	= require('./D_Users.js');

const Program = 'Users';

var Data = {
	Status	: 1000
};

class Users {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_user'
	};
	
	#tableColumn	= {
		tableColumn : {
			user_id: {name: 'user_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			role_id: {name: 'role_id', datatype: 'varchar', length: 0, isNotNull: true, defaultvalue: null, value: null},
			user_fullname: {name: 'user_fullname', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			user_email: {name: 'user_email', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			user_password: {name: 'user_password', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetUsers() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetUsers(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.user_id.value = middleware.Decrypt(value.body.user_id);
		this.#tableColumn.tableColumn.role_id.value = middleware.Decrypt(value.body.role_id);
		this.#tableColumn.tableColumn.user_fullname.value = middleware.Decrypt(value.body.user_fullname);
		this.#tableColumn.tableColumn.user_email.value = middleware.Decrypt(value.body.user_email);
		this.#tableColumn.tableColumn.user_password.value = middleware.Decrypt(value.body.user_password);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Users();
	Init.SetUsers 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let UsersData 	= Init.GetUsers;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, UsersData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, UsersData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, UsersData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, UsersData);
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
