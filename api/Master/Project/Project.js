var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Project.js');
var read 		= require('./R_Project.js');
var update 		= require('./U_Project.js');
var discard 	= require('./D_Project.js');

const Program = 'Project';

var Data = {
	Status: 1000
};

class Project {
	#Identity = {
		UID 		    : '',
		Token		    : '',
		Trigger		    : '',
		Route		    : '',
		IsNeedReturn    : false,
		TableName	    : 'project'
	};
	
	#tableColumn = {
		tableColumn: {
			project_id: {name: 'project_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			workgroup_id: {name: 'workgroup_id', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			division_id: {name: 'division_id', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: null, value: null},
			project_code: {name: 'project_code', datatype: 'varchar', length: 50, isNotNull: true, defaultvalue: null, value: null},
			project_name: {name: 'project_name', datatype: 'varchar', length: 255, isNotNull: true, defaultvalue: '', value: null},
			project_desc: {name: 'project_desc', datatype: 'varchar', length: 255, isNotNull: false, defaultvalue: '', value: null},
			project_date: {name: 'project_date', datatype: 'date', length: 0, isNotNull: true, defaultvalue: null, value: null},
			est_date_completed: {name: 'est_date_completed', datatype: 'date', length: 0, isNotNull: true, defaultvalue: '', value: null},
			project_reference: {name: 'project_reference', datatype: 'varchar', length: 50, isNotNull: false, defaultvalue: '', value: null},
			project_amount: {name: 'project_amount', datatype: 'decimal', length: 10.0, isNotNull: true, defaultvalue: null, value: null},
			created_by: {name: 'created_by', datatype: 'varchar', length: 20, isNotNull: true, defaultvalue: null, value: null},
			modified_by: {name: 'modified_by', datatype: 'varchar', length: 20, isNotNull: false, defaultvalue: '', value: null},
			date_created: {name: 'date_created', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: 'CURRENT_TIMESTAMP', value: null},
			date_modified: {name: 'date_modified', datatype: 'datetime', length: 0, isNotNull: false, defaultvalue: null, value: null},
			status: {name: 'status', datatype: 'int', length: 0, isNotNull: true, defaultvalue: 1, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetProject() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetProject(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.project_id.value = middleware.Decrypt(value.body.project_id);
		this.#tableColumn.tableColumn.workgroup_id.value = middleware.Decrypt(value.body.workgroup_id);
		this.#tableColumn.tableColumn.division_id.value = middleware.Decrypt(value.body.division_id);
		this.#tableColumn.tableColumn.project_code.value = middleware.Decrypt(value.body.project_code);
		this.#tableColumn.tableColumn.project_name.value = middleware.Decrypt(value.body.project_name);
		this.#tableColumn.tableColumn.project_desc.value = middleware.Decrypt(value.body.project_desc);
		this.#tableColumn.tableColumn.project_date.value = middleware.Decrypt(value.body.project_date);
		this.#tableColumn.tableColumn.est_date_completed.value = middleware.Decrypt(value.body.est_date_completed);
		this.#tableColumn.tableColumn.project_reference.value = middleware.Decrypt(value.body.project_reference);
		this.#tableColumn.tableColumn.project_amount.value = middleware.Decrypt(value.body.project_amount);
		this.#tableColumn.tableColumn.created_by.value = middleware.Decrypt(value.body.created_by);
		this.#tableColumn.tableColumn.modified_by.value = middleware.Decrypt(value.body.modified_by);
		this.#tableColumn.tableColumn.date_created.value = middleware.Decrypt(value.body.date_created);
		this.#tableColumn.tableColumn.date_modified.value = middleware.Decrypt(value.body.date_modified);
		this.#tableColumn.tableColumn.status.value = middleware.Decrypt(value.body.status);
	}
}

router.post('/', function(req, res) {
	let Init = new Project();
	Init.SetProject = req;
	
	let Identity = Init.GetIdentity;	
	let ProjectData = Init.GetProject;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, ProjectData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res, ProjectData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, ProjectData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, ProjectData);
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
	Data.Status = 1000;
}

module.exports = router;
