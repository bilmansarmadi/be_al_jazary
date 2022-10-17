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
                'Data': [{
                    'Table' : Data.TableName,
                    'Field' : 'position_id',
                    'Value' : Data.tableColumn.position_id.value,
                    'Syntax': '='
                }]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
					positions.*,
                    organizational_units.organizational_unit_name,
                    work_units.work_unit_name
				FROM
					positions
                INNER JOIN
                    organizational_units ON organizational_units.organizational_unit_id = positions.organizational_unit_id
                INNER JOIN
                    work_units ON work_units.work_unit_id = positions.work_unit_id
				WHERE
					1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'COMBOBOX') {
            var Arr = {
                'Data': [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'position_id',
                        'Value' : Data.tableColumn.position_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'organizational_unit_id',
                        'Value' : Data.tableColumn.organizational_unit_id.value,
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
					positions
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