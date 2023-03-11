var middleware = require('../../assets/nox');
var db 	        = require('nox-db');

var _Data = {
	Status	: 1000
};

module.exports = {
	Create:function(res, Data) {
		if (Data.Route === 'DEFAULT') {

			if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'rprivilege_id',
                    Clause  : "rprivilege_id = '"+ Data.tableColumn.rprivilege_id.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['rprivilege_id']); 
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
            'menu_id',
            'role_id'
        ];
                
        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);        
    }

    return Result;
}