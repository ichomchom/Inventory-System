var ProductInstance = require('../models/productinstance');
var Product = require('../models/product');

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
    
    Product.find({},'title')
    .exec(function(err,products){
    	if(err){return next(err);}
    	//Successful, render
    	res.render('productinstance_form',{title:'Create ProductInstance',product_list:products});
    });


};

// Handle ProductInstance create on POST
exports.productinstance_create_post = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    req.checkBody('product', 'Product must be specified').notEmpty();
    req.checkBody('status', 'Status must be specified').notEmpty();
    req.checkBody('due_date', 'Invalid date').notEmpty();
    req.checkBody('location', 'Location must be specified').notEmpty();

    req.sanitize('product').escape();
    req.sanitize('status').escape();
    req.sanitize('due_date').escape();
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
    	.exec(function (err, products){
    		if(err) {return next(err);}
    		//Successful, render
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