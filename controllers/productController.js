var Product = require ('../models/product');
var ProductInstance = require('../models/productinstance');
var Type = require ('../models/type');

var async = require('async');

exports.index = function(req,res){
	async.parallel({
		product_count: function(callback){
			Product.count(callback);
		},
		product_instance_count: function(callback){
			ProductInstance.count(callback);
		},
		product_instance_available_count: function(callback){
			ProductInstance.count({status:'Available'},callback);
		},
		type_count: function(callback){
			Type.count(callback);
		},
	}, function(err,results){
		res.render('index',{title: 'Inventory Home', error: err, data: results});
		});
};

//Display list of all Products
exports.product_list = function(req, res, next){
	

  Product.find({}, 'productName description type ')
    .populate('type')
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('product_list', { title: 'Product List', product_list: list_products });
    });
    
};

//Display detail page for a specific Product
exports.product_detail = function(req,res){
	
	async.parallel({
		product: function(callback) {
			Product.findById(req.params.id)
			.populate('type')
			.exec(callback);
		},
		product_instance: function(callback){
			ProductInstance.find({'product': req.params.id})
			//.populate('product')
			.exec(callback);
		},
	}, function(err,results){
		if(err){return next(err);}
		//Successful, render
		res.render('product_detail',{title: 'Name', product: results.product, product_instances: results.product_instance});
	
	});
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