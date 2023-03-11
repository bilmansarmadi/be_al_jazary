class Select{
    #tableName = ''
    #columnName = '*'    // default *
    #asColumnName = ''  // AS columnTable
    #isCustomize = false // true/false  use prop 'columnName' for syntax // not yet usable

    setTableName(tableName){
        this.#tableName = tableName
    }
    getTableName(){
        return this.#tableName
    }

    setColumnName(columnName){
        if(!(columnName == undefined
            || columnName == ''
            || columnName == null))
            this.#columnName = columnName
    }
    getColumnName(){
        return this.#columnName
    }

    setAsColumnName(asColumnName){
        this.#asColumnName = asColumnName
    }
    getAsColumnName(){
        return this.#asColumnName
    }

    setIsCustomize(isCustomize){
        this.#isCustomize = isCustomize
    }
    getIsCustomize(){
        return this.#isCustomize
    }
}

module.exports = {
    newSelect: function(){
        return new Select()
    },
    getGenerateSelect: function(selectList){
        var szResultQuery = ""
        
        for(let i=0; i<selectList.length; i++){
            var select =selectList[i]
            if(!(select.getAsColumnName() == undefined
                || select.getAsColumnName() == ''
                || select.getAsColumnName() == null))
                select.setAsColumnName(' AS '+ select.getAsColumnName())

            // if(select.getIsCustomize()){
            //     szResultQuery = szResultQuery + select.getColumnName() + select.getAsColumnName() + ",\n"
            //     continue
            // }

            if(select.getColumnName() == undefined
                || select.getColumnName() == ''
                || select.getColumnName() == null)
                continue

            if(!(select.getTableName() == undefined
                || select.getTableName() == ''
                || select.getTableName() == null))
                select.setColumnName(select.getTableName() + "." + select.getColumnName())
                
            if(select.getColumnName().includes("*")){
                szResultQuery = szResultQuery + select.getColumnName() + ",\n"
            }else{
                szResultQuery = szResultQuery + select.getColumnName() + select.getAsColumnName() + ",\n"
            }
        }
        return szResultQuery.substring(szResultQuery.length-2, 0)
    }

}

