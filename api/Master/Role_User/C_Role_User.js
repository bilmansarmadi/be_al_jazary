var middleware = require('../../assets/nox');
var db 	        = require('nox-db');
var md5         = require('md5');

var _Data = {
	Status	: 1000
};

module.exports = {
	Create:function(res, Data) {
		if (Data.Route === 'DEFAULT') {

			if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'role_id',
                    Clause  : "role_id = '"+ Data.tableColumn.role_id.value +"'",
                    Return  : 'Boolean'
                };

				let columnNameString    = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString   = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    if (feedback) {
                        return db.Transaction(
                                    `INSERT INTO `
                                        + Data.TableName + ` 
                                    (`
                                        + columnNameString +   
                                    `) 
                                    VALUES 
                                    (`
                                        + columnValueString +
                                    `);`
                        );
                    } else {
                        return false;
                    }
                }).then((feedback) => {
                    if (feedback !== false) {
                        middleware.Response(res, feedback);
                    } else {
                        _Data.Status = 3006;
                        middleware.Response(res, _Data);
                    }
                });
			} else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
		} else {
            _Data.Status	= 3003;
            middleware.Response(res, _Data);
        }
	}
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr 	= [
            'role_nama'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}