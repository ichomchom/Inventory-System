var Product = require ('../models/product');

exports.index = function(req,res){
	res.send('NOT IMPLEMENTED: Site Home Page')
};

//Display list of all Products
exports.product_list = function(req, res){
	res.send('NOT IMPLEMENTED: Product list');
};

//Display detail page for a specific Product
exports.product_detail = function(req,res){
	res.send('NOT IMPLEMENTED: Product detail: ' + req.params.id);
};

//Display Product create form on GET
exports.product_create_get = function(req,res){
	res.send('NOT IMPLEMENTED: Product create GET');
};

//Handle Product create on POST
exports.product_create_post = function(req,res){
	res.send('NOT IMPLEMENTED: Product create Post');
};

//Display Product delete form on GET
exports.product_delete_get = function(req,res){
	res.send('NOT IMPLEMENTED: Product delete GET');
};

// Handle Product delete on POST
exports.product_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: product delete POST');
};

// Display Product update form on GET
exports.product_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Product update GET');
};

// Handle Product update on POST
exports.product_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Product update POST');
};