var fs = require('fs');
var middleware 	= require('nox');

module.exports = {
	Read_Id: function(Table){
				
        let Raw_Data = fs.readFileSync('log/db_table_id/table_id.json');
        let Data     = JSON.parse(Raw_Data);

        let Incrmnt = _Counter(Data[Table].digit, Data[Table].increment);
        let Code    = Data[Table].code+Incrmnt;                

        return Code;
	},
    Write_Id: function(Table){
        let File     = 'log/db_table_id/table_id.json';
        let Raw_Data = fs.readFileSync(File);
        let Data     = JSON.parse(Raw_Data);

        Data[Table].increment++;

        fs.writeFileSync(File, JSON.stringify(Data));
    }
};

function _Counter(Digit, Counter){    

    if(Digit === 4){
        if(Counter < 10){
            Counter	= "000" + Counter;
        }else if(Counter > 9 && Counter < 100){
            Counter	= "00" + Counter;
        }else if(Counter > 99 && Counter < 1000){
            Counter	= "0" + Counter;
        }else if(Counter > 999 && Counter < 10000){
            Counter	= Counter;
        }
    }      
    
    return Counter;
}