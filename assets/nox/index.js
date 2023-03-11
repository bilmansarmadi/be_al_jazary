var Setup 	= require('nox-config');
var status 	= require('nox-status');

let Config = Setup.Load_Config();

var strStatus 	= "Status";
var strData 	= "Data";
var strError 	= "Error";
var strMessage 	= "Message";

module.exports = {
	Response: function(Result, Data, bIsNeedReturn = false){

		Result.setHeader('Access-Control-Allow-Origin', '*');
		Result.setHeader('Access-Control-Allow-Methods', 'POST');
		Result.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		Result.setHeader('Access-Control-Allow-Credentials', true);

		var Response 	= status.API_Status(Data);	
		
		if(bIsNeedReturn){
			return Response;
		}

		var Obj	= {
			Status	: Response.Status,
			Data	: Response.Data,
			Error	: Response.Error,
			Message	: Response.Message
		};
		
		Obj = ResponseType(Obj);

		Result.json(Obj);
	},
	TokenValidate: function(Token){
		var Validate = true;
		
		if(Config.Token){
			if(Token == ''){
				Validate = false;
			}
		}		
		
		return Validate;
	},
	Permission: function(Identity){
		var Validate = true;

		if(Config.Permission){
			if(Identity.UID == '' || Identity.Program == ''){
				Validate = false;
			}
		}

		return Validate;
	},
	PrepareInsertQuery: function(sourceColumnObj, isValue){
		var szResult = ""
		for (const property in sourceColumnObj) {
			if(isValue){
				if(sourceColumnObj[property].value){
					szResult = szResult + "'"+ sourceColumnObj[property].value +"',\n"
				}else{
					if(sourceColumnObj[property].isNotNull){
						var szDefault = sourceColumnObj[property].defaultvalue;
						
						if(szDefault == ''){
							szResult = szResult + "'',\n"
						}else if(szDefault == null){
							szResult = szResult + "NULL,\n"
						}else{
							szResult = szResult + "'" + szDefault + "',\n"
						}					
					}else{
						szResult = szResult + "NULL,\n"
					}
				}
			}else{
				szResult = szResult + property +",\n"
			}
		}

		return szResult.substring(szResult.length-2, 0)
	},
	PrepareUpdateQuery: function(sourceColumnObj){
		var szResult = " SET "
		
		for (const property in sourceColumnObj) {
			if(!sourceColumnObj[property].value){
				var szDefault = sourceColumnObj[property].defaultvalue;

				if(szDefault == ''){
					szResult = szResult + property +" = '',\n"
				}else if(szDefault == null){
					szResult = szResult + property +" = NULL,\n"
				}else{
					szResult = szResult + property +" = '" + szDefault + "',\n"
				}				
			}else{
				szResult = szResult + property +" = '"+ sourceColumnObj[property].value +"',\n"
			}
		}

		return szResult.substring(szResult.length-2, 0)
	},
	ExcludeTableColumn(Data, columnList){
		for(let i=0; i<columnList.length; i++){
			delete Data[columnList[i]];
		}

		return Data;
	},
	ValidateData(dto, tableColumnDefineValidate){
		var result = true
		var szMsgOpt = ""
		for (const property in tableColumnDefineValidate) {
			let objDefine = tableColumnDefineValidate[property]
			objDefine.dataType 
			objDefine.length
			objDefine.isNotNull

			if(objDefine.isNotNull){
				if(!dto[property]){
					result = false
					szMsgOpt = szMsgOpt + property+" is not null,\n"
					continue
				}
			}

			if(objDefine.dataType == 'int'){
				if(isNaN(dto[property])){
					result = false
					szMsgOpt = szMsgOpt + property+" data type as integer,\n"
					continue
				}
			}else if(objDefine.dataType == 'date'){
				//new Date('2021-12-11 12:45:46').toISOString().slice(0, 19).replace('T', ' ')
				//dto[property] = new Date(dto[property]).toISOString().slice(0, 19).replace('T', ' ')
			}

			if(objDefine.length){
				if(dto[property].length > objDefine.length){
					result = false
					szMsgOpt = szMsgOpt + property+" length is too long,\n"
					continue
				}
			}
		}

		let data = {message_opt : szMsgOpt.substring(szMsgOpt.length-2, 0), status: 1000}
		if(!result){
			data = {message_opt : szMsgOpt.substring(szMsgOpt.length-2, 0), status: 3000}
		}
		// once false, result false
		let returnObj = {data:data , isValidate: result}
		return returnObj;
	},
	SqlParamGenerator: function(Arr){
		var Query = '';
		var Value = '';
		
		for(var Key in Arr){
			if (Arr.hasOwnProperty(Key)){
				Value = Arr[Key];
				
				if(Array.isArray(Value)){
					Query += " AND " + Key + " IN (" + "'" + Value.join("', '") + "'" + ")";
				}else{
					if(Value !== '' && Value !== null){
						Query += " AND " + Key + " = '" + Value + "'";
					}
				}				
			}
		}
		
		return Query;
	},
	AdvSqlParamGenerator: function(Arr){
		let Qry 	= '';
		let Data	= Arr.Data;
		
		for(let i=0; i<Data.length; i++){
			let Table	= Data[i].Table;
			let Field	= Data[i].Field;
			let Value	= Data[i].Value;
			let ndValue = Data[i].ndValue;
			let Syntax	= Data[i].Syntax;
			let spQry	= Data[i].spQry;	
			let Key		= '';

			let Operator	= 'AND';
			let TempVal		= `'`+Value+`'`;

			if(Field !== '' && Value !== '' && Syntax !== ''){
				if(Syntax === 'BETWEEN'){
					TempVal = `'`+Value+`' AND '`+ndValue+`'`;
				} else if(Syntax === 'IN'){
					TempVal = `(`+Value+`)`;
				}

				if(Table == '' && Value !==''){
					Key  = Field;
				}else{
					Key  = Table+'.'+Field;
				}
	
				Qry += ' '+ Operator +' '+ Key +' '+ Syntax +' '+ TempVal;
			}
			
			if(spQry === true){
				Qry = Qry +' '+ Operator +' '+ Value;
			}
		}

		return Qry;
	},
	Encrypt: function(Data){

	},
	Decrypt: function(Data){		
		if(Data == undefined || Data == null){
			Data = '';
		}else{
			if(Config.end2end){
				Data = 'Gonna Decrypt';
			}
		}

		return Data;
	},
	TriggerValidate: function(Trigger){
		var Validate = true;

		if(Trigger != 'C' && Trigger != 'R' && Trigger != 'U' && Trigger != 'D'){
			Validate = false;
		}

		return Validate;
	},
	CurrentDateTime: function(Format){
		var Data = '';
		
		let Date_Obj = new Date();
		
		let Var_Date 	= ("0" + Date_Obj.getDate()).slice(-2);
		let Var_Month 	= ("0" + (Date_Obj.getMonth() + 1)).slice(-2);
		let Var_Year 	= Date_Obj.getFullYear();
		let Var_Hours 	= Date_Obj.getHours();
		let Var_Minutes = Date_Obj.getMinutes();
		let Var_Seconds = Date_Obj.getSeconds();
		
		if(Format == 'YYYY-MM-DD HH:MM:SS'){
			Data = Var_Year + "-" + Var_Month + "-" + Var_Date + " " + Var_Hours + ":" + Var_Minutes + ":" + Var_Seconds;
		}else if(Format == 'YYYYMMDD'){
			Data = Var_Year + Var_Month + Var_Date;
		}else if(Format == 'YYYY-MM-DD'){
			Data = Var_Year + "-" + Var_Month + "-" + Var_Date;
		}
		
		return Data;
	},
	DataValidation: function(Data, Arr){
		var Result = true;
		
		for(let i=0; i<Arr.length; i++){			
			if(!Data[Arr[i]].value){
				Result = false;
			}			
		}
		
		return Result;
	}
};

function RenameKeys(Obj, NewKeys) {
	const KeyValues = Object.keys(Obj).map(key => {
	  const NewKey = NewKeys[key] || key;
	  return { [NewKey]: Obj[key] };
	});

	return Object.assign({}, ...KeyValues);
}

function ResponseType(Obj){	
	if(Config.ResponseType == 'Lowercase'){
		NewObj 	= {Status:"status",Data:"data",Error:"error",Message:"message"}; 
		Obj 	= RenameKeys(Obj, NewObj);
	}else if(Config.ResponseType == 'Uppercase'){
		NewObj 	= {Status:"STATUS",Data:"DATA",Error:"ERROR",Message:"MESSAGE"}; 
		Obj 	= RenameKeys(Obj, NewObj);
	}

	return Obj;
}