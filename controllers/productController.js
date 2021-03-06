var Product = require ('../models/product');
var ProductInstance = require('../models/productinstance');
var Type = require ('../models/type');
var Tag = require('../models/tag');

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
		tag_count: function(callback){
			Tag.count(callback);
		},
	}, function(err,results){
		res.render('index',{title: 'Inventory Home', error: err, data: results});
		});
};

//Display list of all Products
exports.product_list = function(req, res, next){

  async.parallel({
    list_products: function(callback) {  
        Product.find('productName description type').populate('type').exec(callback);
    },
        
    product_count: function(callback) {            
    	ProductInstance.find({'product': req.params.id}).count(callback);
    },

  /*
   type: function(callback) {  
      Type.findById(req.params.id)
        .exec(callback);
    },
       
    type_products: function(callback) {            
      Product.find({ 'type': req.params.id })
      .exec(callback);
    }, 
 */
	product: function(callback) {
		Product.findById(req.params.id)
		.populate('type')
		.exec(callback);
	},

  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('product_list', { title: 'Product List', product: results.product, product_list:results.list_products} );
  });
 

/*  Product.find({}, 'productName description type ')
    .populate('type')
    .exec(function (err, list_products) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('product_list', { title: 'Product List', product_list: list_products, count: product_count });
    });*/
    
};

//Display detail page for a specific Product
exports.product_detail = function(req,res, next){
	
	async.parallel({
		product: function(callback) {
			Product.findById(req.params.id)
			.populate('type')
			.exec(callback);
		},

		tag: function(callback){
			ProductInstance.find('tag product')
			.populate('tag')
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
		res.render('product_detail',{title: 'Name', product: results.product, product_instances: results.product_instance, tags: results.tag});
	
	});
};

//Display Product create form on GET
exports.product_create_get = function(req,res, next){
	
	//Get all Type, which can use for adding to the product.
	async.parallel({
		types: function(callback){
			Type.find(callback);
		},
		}, function(err, results){
			if(err){return next(err);}
			res.render('product_form',{title: 'Create Product', type_list: results.types});
		
	});
};

//Handle Product create on POST
exports.product_create_post = function(req,res, next){

	req.checkBody('productName','Name must not be empty.').notEmpty();
	//req.checkBody('type','Type must not be empty.').notEmpty();

	req.checkBody('description','Description must not be empty.').notEmpty();


	req.sanitize('productName').escape();
	req.sanitize('type').escape();

	req.sanitize('description').escape();



	req.sanitize('productName').trim();
	//req.sanitize('type').trim();

	req.sanitize('description').trim();



	var product = new Product({
		productName : req.body.productName,
		type: req.body.type,

    	description: req.body.description,

    

	});

	console.log('PRODUCT: ' + product);

	var errors = req.validationErrors();
	if(errors){
		//Some problesm, so re-render the product
		console.log('TYPE: ' +req.body.type);

		console.log('ERROR: ' + errors);
/*
		//Get all type for form
		async.parallel({
			types: function(callback){
				Type.find(callback);
			},
		}, function(err,results){
			if (err){ return next(err);}
			
			//Mark selected types as checked
			
			for(i = 0; i < results.types.length ; i++){
				if(product.type.indexOf(results.types[i]._id) > -1 ) {
					//console.log('IS_TYPE: ' + results.types[i].name);
					//Current type is selected. Set "checked" flag.
					results.types[i].checked = 'true';
					//console.log('ADDED: ' + results.types[i]);
				}
			}
			res.render('product_form', {title: 'Create Product', types:results.types, product: product, errors: errors});
		
		});
	}
	*/
	
	Type.find({}, 'name')
		.exec(function(err, types){

			if(err){return next(err);}
			//success, render		

			res.render('product_form', {title: 'Create Product', type_list:types, selected_type: product.type._id, errors: errors, product:product});
		
		});
		return;
	}
	
	else {
		//Data is invalid
		//TODO: check book if exists, then save
		product.save(function(err){
			if(err){return next(err);}
			//successful - redirect to new bproduct record
			res.redirect(product.url);
		});
	}

};


//Display Product delete form on GET
exports.product_delete_get = function(req,res, next){
	async.parallel({
		product: function(callback){
			Product.findById(req.params.id).populate('type').exec(callback);
		},
		product_instances: function(callback){
			ProductInstance.find({'product':req.params.id}).exec(callback);
		},
	}, function(err,results){
		if(err) {return next(err);}
		//success, render
		res.render('product_delete', {title: 'Delete Product', product: results.product, product_instances: results.product_instances});
	});
};

// Handle Product delete on POST
exports.product_delete_post = function(req, res, next) {
  	
  	async.parallel({
  		product: function(callback){
  			Product.findById(req.params.id).populate('type').exec(callback);
  		},
  		product_instances: function(callback){
  			ProductInstance.find({'product':req.params.id}).exec(callback);
  		},
  	}, function(err,results){
  		if(err) {return next(err);}
  		//success
  		if(results.product_instances.length >0 ){
  			res.render('product_delete',{title: 'Delete Product', product: results.product, product_instances: results.product_instances});
  			return;
  		}
  		else{
  			Product.findByIdAndRemove(req.body.id, function deleteProduct(err){
  				//success go back to product list
  				res.redirect('/catalog/products');
  			});
  		}
  	});
};

// Display Product update form on GET
exports.product_update_get = function(req, res,next) {
	req.sanitize('id').escape();
	req.sanitize('id').trim();

	//Get product, and type for form
	async.parallel({
		product: function(callback){
			Product.findById(req.params.id).populate('type').exec(callback);
		},
		types: function(callback){
			Type.find(callback);
		},

	}, function(err, results){
		if(err){ return next(err);}
/*
            for (var all_t_iter = 0; all_t_iter < results.types.length; all_t_iter++) {
                for (var product_t_iter = 0; product_t_iter < results.product.type.length; product_t_iter++) {
                    if (results.types[all_t_iter]._id.toString()==results.product.type[product_t_iter]._id.toString()) {
                        results.types[all_t_iter].checked='true';
                    }
                }
            }
*/
			res.render('product_form', {title: 'Update Product', type_list: results.types, product:results.product});
	});
};

// Handle Product update on POST
exports.product_update_post = function(req, res, next) {
   //Sanitize id passed in
   req.sanitize('id').escape();
   req.sanitize('id').trim();

   //Check other data
	req.checkBody('productName','Name must not be empty.').notEmpty();
	//req.checkBody('type','Type must not be empty.').notEmpty();

	req.checkBody('description','Description must not be empty.').notEmpty();


	req.sanitize('productName').escape();
	req.sanitize('type').escape();

	req.sanitize('description').escape();



	req.sanitize('productName').trim();
	//req.sanitize('type').trim();

	req.sanitize('description').trim();



	var product = new Product({
		productName : req.body.productName,
		type: req.body.type,

    	description: req.body.description,
		_id:req.params.id


	});


	var errors = req.validationErrors();
	if(errors){
		/*
		async.parallel({
		types: function(callback){
			Type.find(callback);
		},
	}, function (err, results){
		if(err){ return next(err);}
			for(i = 0; i < results.types.length ; i++){
				if(product.type.indexOf(results.types[i]._id) > -1 ) {
					results.types[i].checked = 'true';
				}
			}
			res.render('product_form',{title: 'Update Product', types: results, product: product, errors: errors});
	});
	*/
	Type.find({}, 'name')
		.exec(function(err, types){

			if(err){return next(err);}
			//success, render		

			res.render('product_form', {title: 'Update Product', type_list:types, selected_type: product.type._id, errors: errors, product:product});
		
		});
		return;
	}
	else{
		Product.findByIdAndUpdate(req.params.id, product, {}, function(err,theproduct){
			if(err){return next(err);}
			res.redirect(theproduct.url);
		});
	}
};