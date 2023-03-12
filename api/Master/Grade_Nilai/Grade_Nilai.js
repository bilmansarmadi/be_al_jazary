var express 	= require('express');
var middleware 	= require('nox');
var router 		= express.Router();

var create 		= require('./C_Grade_Nilai.js');
var read 		= require('./R_Grade_Nilai.js');
var update 		= require('./U_Grade_Nilai.js');
var discard 	= require('./D_Grade_Nilai.js');

const Program = 'Grade_Nilai';

var Data = {
	Status	: 1000
};

class grade {
	#Identity		= {
		UID 		: '',
		Token		: '',
		Trigger		: '',
		Route		: '',
		IsNeedReturn: false,
		TableName	: 'm_grade_nilai'
	};
	
	#tableColumn	= {
		tableColumn : {
			grade_id: {name: 'grade_id', datatype: 'int', length: 3, isNotNull: true, defaultvalue: null, value: null},
			grade: {name: 'grade', datatype: 'char', length: 3, isNotNull: true, defaultvalue: '', value: null},
			predikat: {name: 'predikat', datatype: 'varchar', length: 10, isNotNull: true, defaultvalue: '', value: null},
			dari_nilai: {name: 'dari_nilai', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 0, value: null},
			sampai_nilai: {name: 'sampai_nilai', datatype: 'int', length: 3, isNotNull: true, defaultvalue: 0, value: null}
		}
	}
	
	get GetIdentity() {
		return this.#Identity;
	}
	
	get GetGradeNilai() {
		let Obj = {
			...this.#Identity,
			...this.#tableColumn
		};

		return Obj;
	}
	
	set SetGradeNilai(value) {
		this.#Identity.UID 		= middleware.Decrypt(value.body.UID);
		this.#Identity.Token 	= middleware.Decrypt(value.body.Token);
		this.#Identity.Trigger 	= middleware.Decrypt(value.body.Trigger);
		this.#Identity.Route 	= middleware.Decrypt(value.body.Route);			
		
		this.#tableColumn.tableColumn.grade_id.value = middleware.Decrypt(value.body.grade_id);
		this.#tableColumn.tableColumn.grade.value = middleware.Decrypt(value.body.grade);
		this.#tableColumn.tableColumn.predikat.value = middleware.Decrypt(value.body.predikat);
		this.#tableColumn.tableColumn.dari_nilai.value = middleware.Decrypt(value.body.dari_nilai);
		this.#tableColumn.tableColumn.sampai_nilai.value = middleware.Decrypt(value.body.sampai_nilai);
	}
}

router.post('/', function (req, res) {
	let Init 		= new grade();
	Init.SetGradeNilai = req;
	
	let Identity 	= Init.GetIdentity;	
	let GradeNilaiData = Init.GetGradeNilai;

	ResetData();
	
	if (middleware.TokenValidate(Identity.Token)) {
		if (Identity.Trigger === 'C' && middleware.Permission(Identity)) {
			create.Create(res, GradeNilaiData)
		} else if (Identity.Trigger === 'R' && middleware.Permission(Identity)) {
			read.Read(res,GradeNilaiData);
		} else if (Identity.Trigger === 'U' && middleware.Permission(Identity)) {
			update.Update(res, GradeNilaiData);
		} else if (Identity.Trigger === 'D' && middleware.Permission(Identity)) {
			discard.Discard(res, GradeNilaiData);
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
