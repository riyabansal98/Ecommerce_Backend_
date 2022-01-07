const { httpCodes } = require("../constants/backendConfig");
const Category = require("../models/category");

module.exports = {

    listCategories: function(req, res) {
        var responseData = {
            success: false,
            msg: "Error in fetching categories"
        };

        //calling the model function
        Category.listCategories(function(err, result) {
            if(err) {
                return res.status(httpCodes.internalServerError).send(responseData);
            }

            // var responseData = {
            //     success: true,
            //     msg: "Sucessfully fetched categories"
            //     categories: []
            // };
            responseData.success = true;
            responseData.msg = "Sucessfully fetched categories";
            responseData.categories = result;
            return res.status(httpCodes.success).send(responseData);
        });
    }
};