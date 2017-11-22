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
    async.parallel({
        products: function(callback){
            Product.find({},'productName').exec(callback);
        },
        tags: function(callback){
            Tag.find({},'name').exec(callback);
        },
    }, function(err,results){
    if(err){return next(err);}
        //Successful, render
        res.render('productinstance_form',{title:'Create ProductInstance',product_list:results.products, tag_list:results.tags});
    
    });



};

// Handle ProductInstance create on POST
exports.productinstance_create_post = function(req, res, next) {


    req.checkBody('product', 'Product must be specified').notEmpty();
    req.checkBody('status', 'Status must be specified').notEmpty();
    req.checkBody('due_date', 'Invalid date').notEmpty();
    req.checkBody('location', 'Location must be specified').notEmpty();
    req.checkBody('assetId','Asset ID must not be empty.').notEmpty();
    req.checkBody('poNum','P.O. Number must not be empty.').notEmpty();
    req.checkBody('tag', 'Tag must be specified').notEmpty();
    req.checkBody('tagNum','Tag Number must not be empty.').notEmpty();
    req.checkBody('productionDate','Invalid date.').notEmpty();
    req.checkBody('currentCustodianDept','Current Custodian Department must not be empty.').optional();
    req.checkBody('assetCount','Asset Count must not be empty.').notEmpty();
    req.checkBody('acquistionDate','Invalid date.').notEmpty();
    req.checkBody('acquistionDept','Acquistion Department must not be empty.').notEmpty();
    req.checkBody('acquistionProj','Acquistion Project must not be empty.').notEmpty();
   // req.checkBody('assetStatus','Asset Status must not be empty.').notEmpty();
    req.checkBody('lastInventoryDate','Invalid date.').notEmpty();



    req.sanitize('product').escape();
    req.sanitize('status').escape();
  //  req.sanitize('due_date').escape();
    req.sanitize('location').escape();
    req.sanitize('assetId').escape();
    req.sanitize('poNum').escape();
    req.sanitize('tag').escape();
    req.sanitize('tagNum').escape();
    req.sanitize('productionDate').toDate();
    req.sanitize('currentCustodianDept').escape();
    req.sanitize('assetCount').escape();
    req.sanitize('acquistionDate').toDate();
    req.sanitize('acquistionDept').escape();
    req.sanitize('acquistionProj').escape();
  //  req.sanitize('assetStatus').escape();
    req.sanitize('lastInventoryDate').toDate();

    req.sanitize('product').trim();
    req.sanitize('status').trim();
    req.sanitize('due_date').toDate();
    req.sanitize('location').trim();
    req.sanitize('assetId').trim();
    req.sanitize('poNum').trim();
    req.sanitize('tag').trim();
    req.sanitize('tagNum').trim();
    //req.sanitize('productionDate').trim();
    req.sanitize('currentCustodianDept').trim();
    req.sanitize('assetCount').trim();
    //req.sanitize('acquistionDate').trim();
    req.sanitize('acquistionDept').trim();
    req.sanitize('acquistionProj').trim();
  //  req.sanitize('assetStatus').trim();
    //req.sanitize('lastInventoryDate').trim();


    var productinstance = new ProductInstance({
    	product: req.body.product,
    	status: req.body.status,
    	due_date: req.body.due_date,
    	location: req.body.location,
        assetId: req.body.assetId ,
        poNum: req.body.poNum,
        tag: req.body.tag,
        tagNum: req.body.tagNum,
        productionDate: req.body.productionDate,
        currentCustodianDept: req.body.currentCustodianDept,
        assetCount: req.body.assetCount,
        acquistionDate: req.body.acquistionDate,
        acquistionDept: req.body.acquistionDept,
        acquistionProj: req.body.acquistionProj,
     //   assetStatus: req.body.assetStatus,
        lastInventoryDate: req.body.lastInventoryDate
    });

    var errors = req.validationErrors();
    if(errors){
        async.parallel({
            tags: function(callback){
                Tag.find({},'name')
                 .exec(callback);
            },
           products:function(callback){
               Product.find({},'productName')
                .exec(callback);
            },
        },function(err,results){
          if (err) { return next(err); }
          //Successful, so render
          res.render('productinstance_form', { title: 'Create ProductInstance', product_list : results.products, tag_list : results.tags, selected_tag: productinstance.tag._id, selected_product : productinstance.product._id , errors: errors, productinstance:productinstance });
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
        products: function(callback){
            Product.find({},'productName').exec(callback);
        },
        tags: function(callback){
            Tag.find({},'name').exec(callback);
        },
    }, function(err,results){
    if(err){return next(err);}
        //Successful, render
        res.render('productinstance_form',{title:'Update ProductInstance',product_list:results.products, tag_list:results.tags});
    
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
    req.checkBody('assetId','Asset ID must not be empty.').notEmpty();
    req.checkBody('poNum','P.O. Number must not be empty.').notEmpty();
   // req.checkBody('tag', 'Tag must be specified').notEmpty();
    req.checkBody('tagNum','Tag Number must not be empty.').notEmpty();
    req.checkBody('productionDate','Invalid date.').notEmpty();
    req.checkBody('currentCustodianDept','Current Custodian Department must not be empty.').optional();
    req.checkBody('assetCount','Asset Count must not be empty.').notEmpty();
    req.checkBody('acquistionDate','Invalid date.').notEmpty();
    req.checkBody('acquistionDept','Acquistion Department must not be empty.').notEmpty();
    req.checkBody('acquistionProj','Acquistion Project must not be empty.').notEmpty();
   // req.checkBody('assetStatus','Asset Status must not be empty.').notEmpty();
    req.checkBody('lastInventoryDate','Invalid date.').notEmpty();



    req.sanitize('product').escape();
    req.sanitize('status').escape();
  //  req.sanitize('due_date').escape();
    req.sanitize('location').escape();
    req.sanitize('assetId').escape();
    req.sanitize('poNum').escape();
    req.sanitize('tag').escape();
    req.sanitize('tagNum').escape();
    req.sanitize('productionDate').toDate();
    req.sanitize('currentCustodianDept').escape();
    req.sanitize('assetCount').escape();
    req.sanitize('acquistionDate').toDate();
    req.sanitize('acquistionDept').escape();
    req.sanitize('acquistionProj').escape();
  //  req.sanitize('assetStatus').escape();
    req.sanitize('lastInventoryDate').toDate();

    req.sanitize('product').trim();
    req.sanitize('status').trim();
    req.sanitize('due_date').toDate();
    req.sanitize('location').trim();
    req.sanitize('assetId').trim();
    req.sanitize('poNum').trim();
    req.sanitize('tag').trim();
    req.sanitize('tagNum').trim();
    //req.sanitize('productionDate').trim();
    req.sanitize('currentCustodianDept').trim();
    req.sanitize('assetCount').trim();
    //req.sanitize('acquistionDate').trim();
    req.sanitize('acquistionDept').trim();
    req.sanitize('acquistionProj').trim();
  //  req.sanitize('assetStatus').trim();
    //req.sanitize('lastInventoryDate').trim();


    var productinstance = new ProductInstance({
        product: req.body.product,
        status: req.body.status,
        due_date: req.body.due_date,
        location: req.body.location,
        assetId: req.body.assetId ,
        poNum: req.body.poNum,
        tag: req.body.tag,
        tagNum: req.body.tagNum,
        productionDate: req.body.productionDate,
        currentCustodianDept: req.body.currentCustodianDept,
        assetCount: req.body.assetCount,
        acquistionDate: req.body.acquistionDate,
        acquistionDept: req.body.acquistionDept,
        acquistionProj: req.body.acquistionProj,
     //   assetStatus: req.body.assetStatus,
        lastInventoryDate: req.body.lastInventoryDate,
        _id:req.params.id
    });

    var errors = req.validationErrors();
    if(errors){
        async.parallel({
            tags: function(callback){
                Tag.find({},'name')
                 .exec(callback);
            },
           products:function(callback){
               Product.find({},'productName')
                .exec(callback);
            },
        },function(err,results){
          if (err) { return next(err); }
          //Successful, so render
          res.render('productinstance_form', { title: 'Update ProductInstance', product_list : results.products, tag_list : results.tags, selected_tag: productinstance.tag._id, selected_product : productinstance.product._id , errors: errors, productinstance:productinstance });
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