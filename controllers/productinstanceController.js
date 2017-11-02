var ProductInstance = require('../models/productinstance');
var Product = require('../models/product');
var Tag = require('../models/tag');
var async = require('async');

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
exports.productinstance_create_get = function(req, res, next) {
    
    Product.find({},'productName')
    .exec(function(err,products){
    	if(err){return next(err);}
    	//Successful, render
    	res.render('productinstance_form',{title:'Create ProductInstance',product_list:products});
    });


};

// Handle ProductInstance create on POST
exports.productinstance_create_post = function(req, res, next) {


    req.checkBody('product', 'Product must be specified').notEmpty();
    req.checkBody('status', 'Status must be specified').notEmpty();
    req.checkBody('due_date', 'Invalid date').notEmpty();
    req.checkBody('location', 'Location must be specified').notEmpty();

    req.sanitize('product').escape();
    req.sanitize('status').escape();
  //  req.sanitize('due_date').escape();
    req.sanitize('location').escape();

    req.sanitize('product').trim();
    req.sanitize('status').trim();
    req.sanitize('due_date').toDate();
    req.sanitize('location').trim();

    var productinstance = new ProductInstance({
    	product: req.body.product,
    	status: req.body.status,
    	due_date: req.body.due_date,
    	location: req.body.location
    });

    var errors = req.validationErrors();
    if(errors){
  
        Product.find({},'productName')
        .exec(function (err, products) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('productinstance_form', { title: 'Create ProductInstance', product_list : products, selected_product : productinstance.product._id , errors: errors, productinstance:productinstance });
        });
        return;
    }
    else{
    	productinstance.save(function(err){
    		if(err) {return next(err);}
    		//Successful, redirect to new product isntance record
    		res.redirect(productinstance.url);
    	});
    }
};

// Display ProductInstance delete form on GET
exports.productinstance_delete_get = function(req, res, next) {
    ProductInstance.findById(req.params.id)
    .populate('product')
    .exec(function( err, productinstance){
        if(err){return next(err);}
        res.render('productinstance_delete', {title: 'Delete ProductInstance', productinstance: productinstance});
    })
};

// Handle ProductInstance delete on POST
exports.productinstance_delete_post = function(req, res, next) {
    
    ProductInstance.findByIdAndRemove(req.body.id, function deleteProductInstance(err){
        if(err){return next(err);}
        res.redirect('/catalog/productinstances')
    });
};

// Display ProductInstance update form on GET
exports.productinstance_update_get = function(req, res, next) {
    req.sanitize('id').escape();
    req.sanitize('id').trim();

    async.parallel({
        productinstance: function(callback){
            ProductInstance.findById(req.params.id).populate('product').exec(callback)
        },
        products: function(callback){
            Product.find(callback)
        },
    }, function(err, results){
        if(err) {return next(err);}
        res.render('productinstance_form', {title: 'Update ProductInstance',product_list: results.products, selected_product: results.productinstance.product.id, productinstance:results.productinstance});
    
    });
};

// Handle productinstance update on POST
exports.productinstance_update_post = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    req.checkBody('product', 'Product must be specified').notEmpty();
    req.checkBody('status', 'Status must be specified').notEmpty();
    req.checkBody('due_date', 'Invalid date').notEmpty();
    req.checkBody('location', 'Location must be specified').notEmpty();

    req.sanitize('product').escape();
    req.sanitize('status').escape();
  //  req.sanitize('due_date').escape();
    req.sanitize('location').escape();

    req.sanitize('product').trim();
    req.sanitize('status').trim();
    req.sanitize('due_date').toDate();
    req.sanitize('location').trim();

    var productinstance = new ProductInstance({
        product: req.body.product,
        status: req.body.status,
        due_date: req.body.due_date,
        location: req.body.location,
        _id: req.params.id
    });

    var errors = req.validationErrors();
    if(errors){
  
        Product.find({},'productName')
        .exec(function (err, products) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('productinstance_form', { title: 'Update ProductInstance', product_list : products, selected_product : productinstance.product._id , errors: errors, productinstance:productinstance });
        });
        return;
    }
    else{
        ProductInstance.findByIdAndUpdate(req.params.id, productinstance,{}, function(err,theproductinstance){
            if(err) {return next(err);}
            //Successful, redirect to new product isntance record
            res.redirect(productinstance.url);
        });
    }
};