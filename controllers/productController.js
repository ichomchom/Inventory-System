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
exports.product_detail = function(req,res, next){
	
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
	req.checkBody('assetId','Asset ID must not be empty.').notEmpty();
	req.checkBody('poNum','P.O. Number must not be empty.').notEmpty();
	req.checkBody('tagNum','Tag Number must not be empty.').notEmpty();
	req.checkBody('description','Description must not be empty.').notEmpty();
	req.checkBody('productionDate','Invalid date.').notEmpty();
	req.checkBody('currentCustodianDept','Current Custodian Department must not be empty.').optional();
	req.checkBody('assetCount','Asset Count must not be empty.').notEmpty();
	req.checkBody('acquistionDate','Invalid date.').notEmpty();
	req.checkBody('acquistionDept','Acquistion Department must not be empty.').notEmpty();
	req.checkBody('acquistionProj','Acquistion Project must not be empty.').notEmpty();
	req.checkBody('assetStatus','Asset Status must not be empty.').notEmpty();
	req.checkBody('lastInventoryDate','Invalid date.').notEmpty();


	req.sanitize('productName').escape();
	req.sanitize('type').escape();
	req.sanitize('assetId').escape();
	req.sanitize('poNum').escape();
	req.sanitize('tagNum').escape();
	req.sanitize('description').escape();
	req.sanitize('productionDate').toDate();
	req.sanitize('currentCustodianDept').escape();
	req.sanitize('assetCount').escape();
	req.sanitize('acquistionDate').toDate();
	req.sanitize('acquistionDept').escape();
	req.sanitize('acquistionProj').escape();
	req.sanitize('assetStatus').escape();
	req.sanitize('lastInventoryDate').toDate();


	req.sanitize('productName').trim();
	//req.sanitize('type').trim();
	req.sanitize('assetId').trim();
	req.sanitize('poNum').trim();
	req.sanitize('tagNum').trim();
	req.sanitize('description').trim();
	//req.sanitize('productionDate').trim();
	req.sanitize('currentCustodianDept').trim();
	req.sanitize('assetCount').trim();
	//req.sanitize('acquistionDate').trim();
	req.sanitize('acquistionDept').trim();
	req.sanitize('acquistionProj').trim();
	req.sanitize('assetStatus').trim();
	//req.sanitize('lastInventoryDate').trim();


	var product = new Product({
		productName : req.body.productName,
		type: req.body.type,
    	assetId: req.body.assetId ,
    	poNum: req.body.poNum,
    	tagNum: req.body.tagNum,
    	description: req.body.description,
    	productionDate: req.body.productionDate,
    	currentCustodianDept: req.body.currentCustodianDept,
    	assetCount: req.body.assetCount,
    	acquistionDate: req.body.acquistionDate,
    	acquistionDept: req.body.acquistionDept,
    	acquistionProj: req.body.acquistionProj,
    	assetStatus: req.body.assetStatus,
    	lastInventoryDate: req.body.lastInventoryDate
    

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
	req.checkBody('assetId','Asset ID must not be empty.').notEmpty();
	req.checkBody('poNum','P.O. Number must not be empty.').notEmpty();
	req.checkBody('tagNum','Tag Number must not be empty.').notEmpty();
	req.checkBody('description','Description must not be empty.').notEmpty();
	req.checkBody('productionDate','Invalid date.').notEmpty();
	req.checkBody('currentCustodianDept','Current Custodian Department must not be empty.').optional();
	req.checkBody('assetCount','Asset Count must not be empty.').notEmpty();
	req.checkBody('acquistionDate','Invalid date.').notEmpty();
	req.checkBody('acquistionDept','Acquistion Department must not be empty.').notEmpty();
	req.checkBody('acquistionProj','Acquistion Project must not be empty.').notEmpty();
	req.checkBody('assetStatus','Asset Status must not be empty.').notEmpty();
	req.checkBody('lastInventoryDate','Invalid date.').notEmpty();


	req.sanitize('productName').escape();
	req.sanitize('type').escape();
	req.sanitize('assetId').escape();
	req.sanitize('poNum').escape();
	req.sanitize('tagNum').escape();
	req.sanitize('description').escape();
	req.sanitize('productionDate').toDate();
	req.sanitize('currentCustodianDept').escape();
	req.sanitize('assetCount').escape();
	req.sanitize('acquistionDate').toDate();
	req.sanitize('acquistionDept').escape();
	req.sanitize('acquistionProj').escape();
	req.sanitize('assetStatus').escape();
	req.sanitize('lastInventoryDate').toDate();


	req.sanitize('productName').trim();
	//req.sanitize('type').trim();
	req.sanitize('assetId').trim();
	req.sanitize('poNum').trim();
	req.sanitize('tagNum').trim();
	req.sanitize('description').trim();
	//req.sanitize('productionDate').trim();
	req.sanitize('currentCustodianDept').trim();
	req.sanitize('assetCount').trim();
	//req.sanitize('acquistionDate').trim();
	req.sanitize('acquistionDept').trim();
	req.sanitize('acquistionProj').trim();
	req.sanitize('assetStatus').trim();
	//req.sanitize('lastInventoryDate').trim();

	var product = new Product({
		productName : req.body.productName,
		type: req.body.type,
		assetId: req.body.assetId ,
		poNum: req.body.poNum,
		tagNum: req.body.tagNum,
		description: req.body.description,
		productionDate: req.body.productionDate,
		currentCustodianDept: req.body.currentCustodianDept,
		assetCount: req.body.assetCount,
		acquistionDate: req.body.acquistionDate,
		acquistionDept: req.body.acquistionDept,
		acquistionProj: req.body.acquistionProj,
		assetStatus: req.body.assetStatus,
		lastInventoryDate: req.body.lastInventoryDate,
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