const Product = require("../models/product");
const { httpCodes } = require("../constants/backendConfig");

module.exports = {

    listProducts : function(req, res){
        var data = req.body;
        var responseData = {
            success: false,
            msg: "InValid params for fetching products"
        };
        Product.listProducts(data, function(err, result) {
            if(err) {
               return res.status(httpCodes.internalServerError).send(responseData);
            }
            
            responseData.msg = "Successfully fetched product";
            responseData.success = true;
            responseData.products = result;
            return res.status(httpCodes.success).send(responseData);
        });
    }
};