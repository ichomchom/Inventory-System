var ProductInstance = require('../models/productinstance');

// Display list of all ProductInstances
exports.productinstance_list = function(req, res, next) {
    
	ProductInstance.find()
		.populate('product')
		.exec(function (err, list_productinstances) {
			if (err) { return next(err);}
			//Successful, render
			res.render('productinstance_list',{ title: 'Product Instance List', productinstance_list: list_productinstances});
		});
};

// Display detail page for a specific ProductInstance
exports.productinstance_detail = function(req, res, next) {
   
   ProductInstance.findById(req.params.id)
   .populate('product')
   .exec(function(err,productinstance){
	   if (err) {return next(err);}
	   //Successful, render
	   res.render('productinstance_detail',{title:'Product:', productinstance:productinstance});
   });
};

// Display ProductInstance create form on GET
exports.productinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance create GET');
};

// Handle ProductInstance create on POST
exports.productinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance create POST');
};

// Display ProductInstance delete form on GET
exports.productinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance delete GET');
};

// Handle ProductInstance delete on POST
exports.productinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance delete POST');
};

// Display ProductInstance update form on GET
exports.productinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance update GET');
};

// Handle productinstance update on POST
exports.productinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: ProductInstance update POST');
};