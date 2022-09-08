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
                'Data' : [
                    {
                        'Table' : Data.TableName,
                        'Field' : 'submission_number',
                        'Value' : Data.tableColumn.submission_number.value,
                        'Syntax': '='
                    }
                ]
            };

            var Param = middleware.AdvSqlParamGenerator(Arr);

            db.Read(
                `SELECT
                    submission_form.submission_number,
                    submission_form.workgroup_id,
                    submission_form.organizational_unit_id,
                    submission_form.work_unit_id,
                    submission_form.project_id,
                    CONVERT(DATE_FORMAT(submission_form.submission_date, "%d-%m-%Y"), CHAR(20)) AS submission_date,
                    submission_form.submission_desc,
                    submission_form.amount,
                    submission_form.approval_by,
                    submission_form.created_by,
                    submission_form.modified_by,
                    submission_form.date_approval,
                    submission_form.date_created,
                    submission_form.date_modified,
                    submission_form.approval_status,
                    submission_form.allocation_status,
                    submission_form.status,
                    workgroup.workgroup_name,
                    organizational_units.organizational_unit_name,
                    work_units.work_unit_name,
                    project.project_name
                FROM
                    submission_form
                INNER JOIN
                    workgroup ON workgroup.workgroup_id = submission_form.workgroup_id
                INNER JOIN
                    organizational_units ON organizational_units.organizational_unit_id = submission_form.organizational_unit_id
                INNER JOIN
                    work_units ON work_units.work_unit_id = submission_form.work_unit_id
                INNER JOIN
                    project ON project.project_id = submission_form.project_id
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