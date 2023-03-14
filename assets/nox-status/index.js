var Setup 	= require('../nox-config');

let Config  = Setup.Load_Config();

var api_status = {
    1000: {Message: 'Success'},
    2000: {Message: 'DB Connection Error'},
    2001: {Message: 'DB Begin Transaction Error'},
    2002: {Message: 'DB Query Error'},
    2003: {Message: 'DB Commit Error'},
    3000: {Message: 'Execute Failed'},
    3001: {Message: 'Invalid Token'},
    3002: {Message: 'Permission Denied'},
    3003: {Message: 'Invalid Route'},
    3004: {Message: 'Data Not Found'},
    3104: {Message: 'Not Enough Stock'},
    3105: {Message: 'Not Enough Balance'},
    3005: {Message: 'Empty Parameter'},
    3006: {Message: 'Data Already Exist'},
};

module.exports = {
    API_Status: function(Data){
        var Code = Data.Status;

        if(Code >= 1000 && Code < 2000){
            Data.Message = api_status[Code].Message;
        }else if(Code >= 2000 && Code < 3000){
            if(!Config.Debug){
                if(Data.DB == 'MYSQL'){                                               
                    Data.Error  = Data.Data.errno;
                }                
            }                        
            Data.Data       = [];
            Data.Error      = "";
            Data.Message    = api_status[Code].Message;
        }else if(Code >= 3000){
            Data.Data       = [];
            Data.Error      = "";
            Data.Message    = api_status[Code].Message;
        }            

        return Data;
    }
};