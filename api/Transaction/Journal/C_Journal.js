var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
    Create:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            if (DataValidation(Data)) {
                var Req_Journal_Detail = JSON.parse(Data.tableColumn.journal_detail.value);

                var ValidationArr = {
                    Table   : Data.TableName,
                    Field   : 'journal_code',
                    Clause  : "journal_code = '"+ Data.tableColumn.journal_code.value +"'",
                    Return  : 'Boolean'
                };

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['modified_by', 'date_created', 'date_modified', 'journal_detail']);

                let columnNameString = middleware.PrepareInsertQuery(Data.tableColumn, false);
                let columnValueString = middleware.PrepareInsertQuery(Data.tableColumn, true);

                db.Validation(
                    ValidationArr
                ).then((feedback) => {
                    let qry_journal_detail = '';
                    let qry_update_coa = '';

                    if (feedback.length !== 0) {
                        for (var i = 0; i < Req_Journal_Detail.length; i++) {
                            let Line = i + 1;

                            qry_journal_detail += `INSERT INTO journal_detail (
                                journal_code,
                                journal_line,
                                coa_code,
                                description,
                                amount,
                                position,
                                reference
                            )VALUES(
                                '`+Data.tableColumn.journal_code.value+`',
                                '`+Line+`',
                                '`+Req_Journal_Detail[i].coa_code+`',
                                '`+Req_Journal_Detail[i].description+`',
                                '`+Req_Journal_Detail[i].amount+`',
                                '`+Req_Journal_Detail[i].position+`',
                                '`+Req_Journal_Detail[i].reference+`'
                            );`;

                            if (Req_Journal_Detail[i].position === 'D') {
                                qry_update_coa = `UPDATE coa SET ptd_dbalance = ptd_dbalance + ` + Req_Journal_Detail[i].amount + ` WHERE coa_code = '`+ Req_Journal_Detail[i].coa_code +`';`;
                            } else if (Req_Journal_Detail[i].position === 'C') {
                                qry_update_coa = `UPDATE coa SET ptd_cbalance = ptd_cbalance + ` + Req_Journal_Detail[i].amount + ` WHERE coa_code = '`+ Req_Journal_Detail[i].coa_code +`';`;
                            }
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
                            ;`+qry_journal_detail+qry_update_coa
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
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};

function DataValidation(Data) {
    var Result = true;

    if (Data.Route === 'DEFAULT') {
        var ColumnArr = [
            'journal_code',
            'period_code',
            'journal_date',
            'num_entries',
            'debit_amount',
            'credit_amount',
            'gl_status',
            'created_by',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}