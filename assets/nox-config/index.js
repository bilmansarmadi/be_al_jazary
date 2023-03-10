class Config{
	#Data	  = {
		Debug 	    : true,
		end2end	    : false,
		Token       : true,
        Permission	: true,	
        Log         : true,
        ConsoleQuery: true,
        ResponseType: 'Capitalisation',
        Url_Img     : 'http://localhost:3000/api/images',
        DB_Default  : {
            Type                : 'MYSQL',
            Host                : process.env.MYSQLDB_HOST,
            User                : process.env.MYSQLDB_USER,
            Password            : process.env.MYSQLDB_ROOT_PASSWORD,
            Database            : process.env.MYSQLDB_DATABASE,
            Multiple_Statements : true
        },
        DB_Test     : {
            Type                : 'MYSQL',
            Host                : 'localhost',
            User                : 'root',
            Password            : '',
            Database            : 'test',
            Multiple_Statements : true
        }
	};
	
	get Load(){		
		return this.#Data;
	}
}

module.exports = {
    Load_Config: function(){
        let Init 	= new Config();
        let Data    = Init.Load;

        return Data;
    }
}