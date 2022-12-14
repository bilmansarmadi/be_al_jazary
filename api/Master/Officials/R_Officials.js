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
        if (Data.Route === 'DEFAULT_EOP') {
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
                        'Field' : 'organizational_unit_id',
                        'Value' : Data.tableColumn.organizational_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'work_unit_id',
                        'Value' : Data.tableColumn.work_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'position_id',
                        'Value' : Data.tableColumn.position_id.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
					officials.*,
                    positions.position_name,
                    submission_form.money_status
				FROM
					officials
                INNER JOIN
                    positions ON positions.position_id = officials.position_id
                INNER JOIN
                    submission_form ON submission_form.submission_number = officials.submission_number
				WHERE
					1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'DEFAULT_ALL') {
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
                        'Field' : 'organizational_unit_id',
                        'Value' : Data.tableColumn.organizational_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'work_unit_id',
                        'Value' : Data.tableColumn.work_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'position_id',
                        'Value' : Data.tableColumn.position_id.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
					officials.official_id,
                    officials.submission_number,
                    officials.organizational_unit_id,
                    officials.work_unit_id,
                    officials.position_id,
                    positions.position_name,
                    officials.official_name,
                    officials.official_rank,
                    officials.amount_submission,
                    officials.amount_checking,
                    officials.amount_approval,
                    officials.paid_status,
                    officials.created_by,
                    officials.modified_by,
                    officials.date_created,
                    officials.date_modified,
                    officials.status_submission,
                    officials.status_checking,
                    officials.status_approval,
                    officials.status
				FROM
					officials
                INNER JOIN
                    positions ON positions.position_id = officials.position_id
				WHERE
					1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'HISTORY_OFFICIALS') {
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
                        'Field' : 'organizational_unit_id',
                        'Value' : Data.tableColumn.organizational_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'work_unit_id',
                        'Value' : Data.tableColumn.work_unit_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : Data.TableName,
                        'Field' : 'position_id',
                        'Value' : Data.tableColumn.position_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : 'project',
                        'Field' : 'project_id',
                        'Value' : Data.tableColumn.project_id.value,
                        'Syntax': '='
                    },
                    {
                        'Table' : 'submission_form',
                        'Field' : 'submission_permission',
                        'Value' : Data.tableColumn.submission_permission.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    project.project_id,
                    project.project_name,
                    project.project_amount,
                    positions.position_id,
                    CASE
                        WHEN positions.position_name IS NULL THEN officials.position_name
                        ELSE positions.position_name
                    END AS position_name,
                    officials.official_id,
                    officials.official_name,
                    officials.amount_approval AS amount,
                    officials.paid_status
                FROM
                    officials
                INNER JOIN
                    submission_form ON submission_form.submission_number = officials.submission_number
                INNER JOIN
                    project ON project.project_id = submission_form.project_id
                LEFT JOIN
                    positions ON positions.position_id = officials.position_id
                WHERE
                    project.project_amount BETWEEN ` + Data.tableColumn.amount_range_from.value + ` AND ` + Data.tableColumn.amount_range_to.value + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else {
            _Data.Status = 3003;
            middleware.Response(res, _Data);
        }
    }
};