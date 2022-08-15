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
            Data.tableColumn.cashbank_id.value = ID.Read_Id(Data.TableName);

            if (DataValidation(Data)) {
                var Req_Cashbank_Detail = JSON.parse(Data.tableColumn.cashbank_detail.value);
                
                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'cashbank_id',
                    Clause  : "cashbank_id = '"+ Data.tableColumn.cashbank_id.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified', 'cashbank_detail', 'guarantee_id', 'project_id', 'coa_code', 'description', 'amount']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    let qry_cashbank_detail = '';

                    if (feedback.length !== 0) {
                        for (var i = 0; i < Req_Cashbank_Detail.length; i++) {
                            let Line = i + 1;
                            
                            qry_cashbank_detail += `INSERT INTO cashbank_detail (
                                cashbank_id,
                                guarantee_id,
                                project_id,
                                cashbank_line,
                                coa_code,
                                account_number,
                                description,
                                amount,
                                reference
                            )VALUES(
                                '`+Data.tableColumn.cashbank_id.value+`',
                                '`+Req_Cashbank_Detail[i].guarantee_id+`',
                                '`+Req_Cashbank_Detail[i].project_id+`',
                                '`+Line+`',
                                '`+Req_Cashbank_Detail[i].coa_code+`',
                                '`+Req_Cashbank_Detail[i].account_number+`',
                                '`+Req_Cashbank_Detail[i].description+`',
                                '`+Req_Cashbank_Detail[i].amount+`',
                                '`+Req_Cashbank_Detail[i].reference+`'
                            );`;
                        }

                        return db.Transaction(
                            `INSERT INTO `
                                + Data.TableName + ` 
                            (`
                                + columnNameString +   
                            `) 
                            VALUES 
                            (`
                                + columnValueString +
                            `)
                            ;`+qry_cashbank_detail
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
            'cashbank_id',
            'period_code',
            'cashbank_date',
            'cashbank_type',
            'account_number',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}