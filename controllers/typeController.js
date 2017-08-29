var Type = require('../models/type');
var Product = require('../models/product');
var async = require('async');

// Display list of all Type
exports.type_list = function(req, res, next) {
    Type.find()
	.sort([['name','ascending']])
	.exec(function (err, list_types) {
			if (err) { return next(err);}
			//Successful, render
			res.render('type_list',{ title: 'Type List', type_list: list_types});
		});
};

// Display detail page for a specific Type
exports.type_detail = function(req, res, next) {

  async.parallel({
    type: function(callback) {  
      Type.findById(req.params.id)
        .exec(callback);
    },
        
    type_products: function(callback) {            
      Product.find({ 'type': req.params.id })
      .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('type_detail', { title: 'Type Detail', type: results.type, type_products: results.type_products } );
  });

};

// Display Type create form on GET
exports.type_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Type create GET');
};

// Handle Type create on POST
exports.type_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Type create POST');
};

// Display Type delete form on GET
exports.type_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Type delete GET');
};

// Handle Type delete on POST
exports.type_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Type delete POST');
};

// Display Type update form on GET
exports.type_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Type update GET');
};

// Handle Type update on POST
exports.type_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Type update POST');
};