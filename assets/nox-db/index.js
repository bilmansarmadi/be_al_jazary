var Setup = require('../nox-config');
var mysql = require('../mysql');
var mylog = require('../nox-log');

var db = '';

function OpenConnection(DB){

	var Config		= Setup.Load_Config();	
	var Host 		= '';
	var User 		= '';
	var Password 	= '';
	var Database	= '';
	
	var MultipleStatement = '';	

	Host 		= Config[DB].Host;
	User 		= Config[DB].User;
	Password 	= Config[DB].Password;
	Database 	= Config[DB].Database;
	
	MultipleStatement = Config[DB].Multiple_Statements;	

	db = mysql.createPool({
		connectionLimit: 100,		
		host: Host,
		user: User,
		password: Password,
		database: Database,
		multipleStatements: MultipleStatement
	});
}

function CloseConnection(){
	db.end(function (err) {
		// all connections in the pool have ended
	});
}

function Init(DB){
	var Config		= Setup.Load_Config();	

	if(db == ''){			
		OpenConnection(DB);				
	}else{
		if(DB != 'DB_DEFAULT' && db != ''){
			CloseConnection();
			OpenConnection(DB);			
		}
	}

	Data.DB	= Config[DB].Type;
}

module.exports = {
	Transaction: function(Query, DB = 'DB_Default'){
		
		return new Promise((resolve, reject) => {
			let Config		= Setup.Load_Config();	
			
			if(Config.ConsoleQuery){
				console.log("query: ", Query);
			}

			ResetData();
			Init(DB);				
			
			db.getConnection(function(err, connection){
				if(err){
					Data.Status = 2000; 
					Data.Data	= err;
					mylog.Write_Error(Data.DB, 'Connection', err);

					resolve(Data);
				}
				else{
					connection.beginTransaction(function(err){
						if(err){Data.Status=2001; Data.Data=err; throw err;}
					
						connection.query(Query, function(error, results, fields) {
							if(error){
								connection.rollback();	
								Data.Status = 2002;	
								//error.sql	= error.sql.replace(/[\n\r]/g,' ');
								Data.Data	= error;				
								mylog.Write_Error(Data.DB, 'Query', error);
							}else{																
								connection.commit(function(err) {
									if(err){
										connection.rollback();
										Data.Status = 2003;
										Data.Data	= err;							
									}						
								});	
							}
							
							connection.release();											
							
							resolve(Data);
						});
					});		
				}				
			});
		});					
	},
	Read: function(Query, DB = 'DB_Default'){		

		return new Promise((resolve, reject) => {
			let Config		= Setup.Load_Config();	
		
			if(Config.ConsoleQuery){
				console.log("query: ", Query);
			}

			ResetData();
			Init(DB);
			//console.log('Before:',db['_allConnections']);

			//OpenConnection(DB);			

			db.getConnection(function(err, connection){
				if(err){
					Data.Status = 2000; 
					Data.Data	= err;
					mylog.Write_Error(Data.DB, 'Connection', err);

					resolve(Data);
				}
				else{		
					connection.query(Query, function (error, rows, fields){				
						if(error){
							Data.Status = 2002;	
							//error.sql	= error.sql.replace(/[\n\r\t]/g, '');					
							Data.Data	= error;				
							mylog.Write_Error(Data.DB, 'Query', error);
						}else{
							if(rows.length > 0){
								Data.Data 	= rows;
							}else{
								Data.Status = 3004;
							}										
						}
						
						connection.release();				

						resolve(Data);
					});		
				}
				
				/*db.end(function (err) {
					// all connections in the pool have ended
				});*/			
			});		
		});							
	},
	Validation: function(Arr, DB = 'DB_Default'){
		return new Promise((resolve, reject) => {
			let Config	= Setup.Load_Config();
			let Result	= "";	
			let Query	= "";

			if(Arr.Table || Arr.Field || Arr.Clause || Arr.Return){
				if(Arr.Return === 'Boolean' || Arr.Return === 'Counter'){
					Query	= `SELECT COUNT(` + Arr.Field + `) AS counter FROM ` + Arr.Table + ` WHERE ` + Arr.Clause;
				}else if(Arr.Return === 'Data'){
					Query	= `SELECT `+ Arr.Field +` FROM ` + Arr.Table + ` WHERE ` + Arr.Clause;
				}
			}
			
			if(Query){
				if(Config.ConsoleQuery){
					console.log("query: ", Query);
				}

				ResetData();
				Init(DB);								

				db.getConnection(function(err, connection){
					if(err){
						Data.Status = 2000; 
						Data.Data	= err;
						mylog.Write_Error(Data.DB, 'Connection', err);

						resolve(Data);
					}
					else{		
						connection.query(Query, function (error, rows, fields){				
							if(error){
								Data.Status = 2002;	
								//error.sql	= error.sql.replace(/[\n\r\t]/g, '');					
								Data.Data	= error;				
								mylog.Write_Error(Data.DB, 'Query', error);
							}else{																	
								if(Arr.Return === 'Boolean'){
									if(rows[0].counter > 0){
										Result = false;
									}else{
										Result = true;
									}															
								}else if(Arr.Return === 'Counter'){
									Result = rows[0].counter;
								}else if(Arr.Return === 'Data'){
									Result = rows;
								}																																		
							}
							
							connection.release();				

							resolve(Result);
						});		
					}										
				});	
			}else{
				reject('Query is Empty');
			}	
		});	
	}
};

var Data = {
	Status	: 1000,
	Data	: [],
	Error	: '',
	Message	: '',
	DB		: ''
};

function ResetData(){
	Data.Status 	= 1000;
	Data.Data 		= [];
	Data.Error 		= '';
	Data.Message 	= '';
	Data.DB 		= '';
}