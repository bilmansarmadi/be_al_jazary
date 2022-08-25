var middleware   = require('nox');
var db           = require('nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
    Update:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : Data.TableName,
                        'Field' : 'cashbank_id',
                        'Value' : Data.tableColumn.cashbank_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['cashbank_id', 'created_by', 'date_created', 'cashbank_detail', 'guarantee_id', 'project_id', 'coa_code', 'description', 'amount', 'daily_monthly']);
                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE `
                        + Data.TableName
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedback) => {
                    if (feedback.Status === 1000) {
                        middleware.Response(res, feedback);
                    } else {
                        middleware.Response(res, feedback);
                    }
                });
            } else {
                _Data.Status = 3005;
                middleware.Response(res, _Data);
            }
        } else if (Data.Route === 'DETAIL') {
            if (DataValidation(Data)) {
                var Arr = {
                    'Data': [{
                        'Table' : 'cashbank_detail',
                        'Field' : 'cashbank_id',
                        'Value' : Data.tableColumn.cashbank_id.value,
                        'Syntax': '='
                    }]
                };

                var Param = middleware.AdvSqlParamGenerator(Arr);

                Data.tableColumn = middleware.ExcludeTableColumn(Data.tableColumn, ['cashbank_id', 'period_code', 'cashbank_desc', 'cashbank_date', 'cashbank_type', 'created_by', 'modified_by', 'posted_by', 'date_created', 'date_modified', 'date_posted', 'status', 'cashbank_detail']);
                let columnValueString = middleware.PrepareUpdateQuery(Data.tableColumn);

                db.Transaction(
                    `UPDATE
                        cashbank_detail `
                        + columnValueString +`
                    WHERE
                        1=1 ` + Param
                ).then((feedback) => {
                    if (feedback.Status === 1000) {
                        middleware.Response(res, feedback);
                    } else {
                        middleware.Response(res, feedback);
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
            // 'period_code',
            'cashbank_date',
            'cashbank_type',
            'account_number',
            'modified_by',
            'date_modified',
            'status'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    } else if (Data.Route === 'DETAIL') {
        var ColumnArr = [
            'cashbank_id'
        ];

        Result = middleware.DataValidation(Data.tableColumn, ColumnArr);
    }

    return Result;
}