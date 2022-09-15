var middleware  = require('nox');
var db          = require('nox-db');

var _Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: ''
};

module.exports = {
    Read:function(res, Data) {
        if (Data.Route === 'DEFAULT') {
            var Arr = {
                'Data': [{
                    'Table' : Data.TableName,
                    'Field' : 'project_id',
                    'Value' : Data.tableColumn.project_id.value,
                    'Syntax': '='
                }]
            };

            var Param   = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT 
					project.project_id,
                    project.workgroup_id,
                    project.division_id,
                    project.organizational_unit_id,
                    project.work_unit_id,
                    project.project_code,
                    project.project_name,
                    project.project_desc,
                    CONVERT(DATE_FORMAT(project.project_date, "%d-%m-%Y"), CHAR(20)) AS project_date,
                    CONVERT(DATE_FORMAT(project.est_date_completed, "%d-%m-%Y"), CHAR(20)) AS est_date_completed,
                    project.project_reference,
                    project.project_amount,
                    project.created_by,
                    project.modified_by,
                    project.date_created,
                    project.date_modified,
                    project.status,
                    workgroup.workgroup_name,
                    organizational_units.organizational_unit_name,
                    work_units.work_unit_name
				FROM
					project
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = project.workgroup_id
                INNER JOIN
                    organizational_units ON organizational_units.organizational_unit_id = project.organizational_unit_id
                INNER JOIN
                    work_units ON work_units.work_unit_id = project.work_unit_id
				WHERE
					1=1 ` + Param
            ).then((feedback) => {
                middleware.Response(res, feedback);
            });
        } else if (Data.Route === 'COMBOBOX') {
            var Arr = {
                'Data': [{
                    'Table' : Data.TableName,
                    'Field' : 'project_id',
                    'Value' : Data.tableColumn.project_id.value,
                    'Syntax': '='
                }]
            };

            var Param   = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT 
					*
				FROM
					project
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