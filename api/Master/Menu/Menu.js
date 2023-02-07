var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Menu.js');
var read 		= require('./R_Menu.js');
var update 		= require('./U_Menu.js');
var discard 	= require('./D_Menu.js');

const Program = 'Menu';

var Data = {
	Status	: 1000
};

class Menu {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_menu'
	};
	
	#tableColumn	= {
		tableColumn : {
			menu_id: {name: 'menu_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			parent_id: {name: 'parent_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: 0, value: null},
			menu_nama: {name: 'menu_nama', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: null, value: null},
			menu_lvl: {name: 'menu_lvl', datatype: 'smallint', length: 6, isNotNull: true, defaultvalue: 0, value: null},
			menu_icon: {name: 'menu_icon', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			menu_url: {name: 'menu_url', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			menu_deskripsi: {name: 'menu_deskripsi', datatype: 'varchar', length: 100, isNotNull: true, defaultvalue: '', value: null},
			menu_urutan: {name: 'menu_urutan', datatype: 'int', length: 11, isNotNull: true, defaultvalue: 1, value: null},
			menu_status: {name: 'menu_status', datatype: 'tinyint', length: 4, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetMenu() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetMenu(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.menu_id.value = middleware.Decrypt(value.body.menu_id);
		this.#tableColumn.tableColumn.menu_deskripsi.value = middleware.Decrypt(value.body.menu_deskripsi);
		this.#tableColumn.tableColumn.parent_id.value = middleware.Decrypt(value.body.parent_id);
		this.#tableColumn.tableColumn.menu_nama.value = middleware.Decrypt(value.body.menu_nama);
		this.#tableColumn.tableColumn.menu_icon.value = middleware.Decrypt(value.body.menu_icon);
		this.#tableColumn.tableColumn.menu_lvl.value = middleware.Decrypt(value.body.menu_lvl);
		this.#tableColumn.tableColumn.menu_url.value = middleware.Decrypt(value.body.menu_url);
		this.#tableColumn.tableColumn.menu_status.value = middleware.Decrypt(value.body.menu_status);
		this.#tableColumn.tableColumn.menu_urutan.value = middleware.Decrypt(value.body.menu_urutan);
	}
}

router.post('/', function (req, res) {
	let Init 		= new Menu();
	Init.SetMenu 	= req;
	
	let Identity 	= Init.GetIdentity;	
	let MenuData 	= Init.GetMenu;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, MenuData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, MenuData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, MenuData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, MenuData);
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
