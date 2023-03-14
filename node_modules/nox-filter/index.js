class Filter{
    #tableName = ''
    #columnName = ''
    #value = '' 
    #value2Opt = ''
    #syntax = '' // LIKE, =, etc  
    #operator = 'AND' // AND, OR, etc
    #isCustomize = false // true/false  use prop 'value' for syntax

    setTableName(tableName){
        this.#tableName = tableName
    }
    getTableName(){
        return this.#tableName
    }

    setColumnName(columnName){
        this.#columnName = columnName
    }
    getColumnName(){
        return this.#columnName
    }

    setValue(value){
        this.#value = value
    }
    getValue(){
        return this.#value
    }

    setValue2Opt(value2Opt){
        this.#value2Opt = value2Opt
    }
    getValue2Opt(){
        return this.#value2Opt
    }

    setSyntax(syntax){
        this.#syntax = syntax
    }
    getSyntax(){
        return this.#syntax
    }

    setOperator(operator){
        if(!(operator == undefined
            || operator == ''
            || operator == null))
            this.#operator = operator
    }
    getOperator(){
        return this.#operator
    }

    setIsCustomize(isCustomize){
        this.#isCustomize = isCustomize
    }
    getIsCustomize(){
        return this.#isCustomize
    }
}

module.exports = {
    newFilter: function(){
        return new Filter()
    },
    getGenerateFilter: function(filterList){
        var szResultQuery = "1=1\n"
        
        for(let i=0; i<filterList.length; i++){
            var filter = filterList[i]
    
            if(filter.getIsCustomize()){
                szResultQuery = szResultQuery + filter.getOperator() + ' ' + filter.getValue() + "\n"
                continue
            }
    
            if(filter.getValue() == undefined
                || filter.getValue() == ''
                || filter.getValue() == null)
                continue
            
            if(!(filter.getTableName() == undefined
                || filter.getTableName() == ''
                || filter.getTableName() == null))
                filter.setColumnName(filter.getTableName() + "." + filter.getColumnName())
    
            if(filter.getSyntax() != ''){
                var finalValue = "'"+filter.getValue()+"'"
    
                switch (filter.getSyntax().toUpperCase()) {
                    case 'LIKE':
                    case 'NOT LIKE':
                        finalValue = "'%"+filter.getValue()+"%'"
                        break
                    case 'IN':
                    case 'NOT IN':
                        finalValue = "('"+filter.getValue()+"')"
                        if(Array.isArray(filter.getValue())){
                            finalValue = ""
                            for(let iter=0;iter<filter.getValue().length;iter++){
                                finalValue = finalValue+"'"+filter.getValue()[iter]+"', "
                            }
                            finalValue.substring(finalValue.length-2, 0)
                            finalValue = "("+finalValue+")"
                        }
                        break
                    case 'BETWEEN':
                    case 'NOT BETWEEN':
                        finalValue = "'"+filter.getValue()+"' AND '"+filter.getValue2Opt()+"'"
                        break
                    case 'IS NULL':
                    case 'IS NOT NULL':
                        finalValue = ""
                        break
                    default:
                        break
                }
    
                szResultQuery = szResultQuery + filter.getOperator() + ' ' + filter.getColumnName() + ' ' + filter.getSyntax() + ' ' + finalValue + "\n"
            }
        }
        return szResultQuery
    }

}

