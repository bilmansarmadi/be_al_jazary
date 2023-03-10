var fs = require('fs');
var middleware 	= require('nox');;

module.exports = {
	Write_Error: function(DB, Error_Type ,Data){
				
		var File		= '';
		var New_Obj		= '';
		var DateTime 	= '';
		var Obj			= '';
		var Json		= '';
		var Log_Data	= '';
		var File_Name	= '';
		
		DateTime 	= middleware.CurrentDateTime('YYYY-MM-DD HH:MM:SS');			
		File_Name	= middleware.CurrentDateTime('YYYYMMDD') + '.json';
		
		if(DB == 'MYSQL'){
			if(Error_Type == 'Query'){
				File		= 'log/db_mysql_query_error_log/' + File_Name;
				New_Obj		= {Error:[]};
				
				Log_Data 	=	{
									date		: DateTime,
									code		: Data.code, 
									errno		: Data.errno,
									sqlMessage	: Data.sqlMessage,
									sqlState	: Data.sqlState,
									sql			: Data.sql
								};
			}else if(Error_Type == 'Connection'){
				File		= 'log/db_mysql_connection_error_log/' + File_Name;
				New_Obj		= {Error:[]};
				
				Log_Data 	=	{
									date		: DateTime,
									code		: Data.code, 
									errno		: Data.errno,
									syscall		: Data.syscall,
									address		: Data.address,
									port		: Data.port,
									fatal		: Data.fatal
								};
			}
		}				
			
		fs.stat(File, function(err, stat) {
			if(err == null){
				fs.readFile(File, 'utf8', function(err,data){
					Obj 	= JSON.parse(data);	
					
					Obj.Error.push(Log_Data);            
					
					Json 	= JSON.stringify(Obj);
					
					fs.writeFile(File, Json, function(err){
						if(err){throw err};			
					});
				});
			}else if(err.code === 'ENOENT') {
				New_Obj.Error.push(Log_Data);
				
				Json 	= JSON.stringify(New_Obj);
				
				fs.writeFile(File, Json, function(err){
					if(err){throw err};			
				});
			}else{
				console.log('Some other error: ', err.code);
			}
		});
	}
};