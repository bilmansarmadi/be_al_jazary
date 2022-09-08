var middleware  = require('nox');
var db          = require('nox-db');
var ID          = require('nox-gen-id');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
    Create:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            Data.tableColumn.project_id.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'project_id',
                    Clause  : "project_id = '"+ Data.tableColumn.project_id.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn        = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified']);

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
                        ID.Write_Id(Data.TableName);
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
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr = [
            'project_id',
            'workgroup_id',
            'organizational_unit_id',
            'work_unit_id',
            'project_code',
            'project_name',
            'project_date',
            'est_date_completed',
            'project_amount',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}