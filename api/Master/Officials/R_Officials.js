var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
    Status  : 1000,
    Data    : [],
    Error   : '',
    Message : ''
};

module.exports = {
    Read:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'official_id',
                        'Value' : Data.tableColumn.official_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'work_unit_id',
                        'Value' : Data.tableColumn.work_unit_id.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
					*
				FROM
					officials
				WHERE
					1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};