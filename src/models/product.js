const sqlConnection = require("../services/sqlConnection");

// /product/1/details body: {"query": "SonyTV"} -> Get response for items which have substring SONYTV
 
module.exports = {

    listProducts: function(data, callback) {

        var sql = "SELECT ID as productId, Name as name, Price as price FROM Products";
        var values = []; //taking parameters for ? 
        if(data.categoryId) {
            sql += " WHERE CategoryId = ?"
            values.push(data.categoryId);
            if(data.query) {
                sql += " AND LOCATE('" + data.query + "', Name)";
            }
            if(data.minPrice) {
                sql += " AND PRICE >= " + parseInt(data.minPrice, 10);
            }
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.query){ //SEARCH 
            sql += "WHERE LOCATE('" + data.query + "', Name)";
            if(data.minPrice) {
                sql += " AND PRICE >= " + parseInt(data.minPrice, 10);
            }
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.minPrice) { //FILTER
            //sql = SELECT ID as productId, Name as name, Price as price FROM Products  
            sql += " WHERE PRICE >= " + parseInt(data.minPrice, 10);
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.maxPrice && parseInt(data.maxPrice, 10) > 0){
            sql += "WHERE PRICE <= " + parseInt(data.maxPrice, 10);
        }

        sqlConnection.executeQuery(sql, values, function(error, result){
            callback(error, result);
        });
    }
};