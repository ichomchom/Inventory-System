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
exports.type_create_get = function(req, res, next) {
    res.render('type_form',{title:'Create Type'});
};

// Handle Type create on POST
exports.type_create_post = function(req, res, next) {
    
    //Check that the name of the field is not empty
    req.checkBody('name', 'Type name required').notEmpty();

    //Trim and escape name field.
    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a type object with escaped and trimmed data.
    var type = new Type(
      {name: req.body.name}
      );

    if(errors){
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('type_form',{title:'Create Type', type: type, errors: errors});
      return;
    }
    else{
      //Data is valid
      //Check if Type with the same name already exists

      Type.findOne({'name' : req.body.name})
        .exec (function(err,found_type){
          console.log('found_type: ' + found_type);
          if(err){return next(err);}

          if(found_type){
            //Type exists, redirect to detail page
            res.redirect(found_type.url);
          }
          else {
            type.save(function(err){
              if (err) {return next(err);}
              //Type saved. Redirect to type detail page
              res.redirect(type.url);
            });
          }
        });
    }
};

// Display Type delete form on GET
exports.type_delete_get = function(req, res, next) {
    async.parallel({
      type: function(callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_products: function(callback) {
        Product.find({'type': req.params.id}).exec(callback);
      },
    }, function(err, results){
      if(err) {return next(err);}
      //Successful, render
      res.render('type_delete', {title:'Delete Type', type: results.type, type_products:results.type_products});
    });
};

// Handle Type delete on POST
exports.type_delete_post = function(req, res, next) {
    
    req.checkBody('id', 'Type id must be exist').notEmpty();

    async.parallel({
      type: function(callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_products: function(callback){
        Product.find({'type': req.params.id},'product description').exec(callback);
      },
    }, function(err,results){
      if (err) {return next(err);}
      //success
      if (results.type_products.length > 0) {
        //Type has products. Render as get route
            res.render('type_delete', { title: 'Delete Type', type: results.type, type_products: results.type_products } );
        return;
      }
      else{
        Type.findByIdAndRemove(req.body.id, function deleteType(err){
          if(err) {return next(err);}
          res.redirect('/catalog/types');
        })
      }
    });
};

// Display Type update form on GET
exports.type_update_get = function(req, res, next) {

  req.sanitize('id').escape();
  req.sanitize('id').trim();

  Type.findById(req.params.id, function(err,type){
    if(err) {return next(err);}
    //success
    res.render('type_form', {title: 'Update Type', type: type});
  });

};

// Handle Type update on POST
exports.type_update_post = function(req, res, next) {

   //Escape the field
   req.sanitize('id').escape();
   req.sanitize('id').trim();


     //Check name is not empty
   req.checkBody('name', 'Type name required').notEmpty();

   //Trim the field
   req.sanitize('name').escape();
   req.sanitize('name').trim();

   var errors = req.validationErrors();

   //Create Type object with escaped and trimmed data
   var type = new Type({
    name: req.body.name,
    _id: req.params.id
  });

   if(errors){
    res.render('type_form',{title: 'Update Type', type:type, errors: errors});
    return;
   }
   else{
    Type.findByIdAndUpdate(req.params.id, type, {}, function(err,thetype){
      if (err){ return next(err);}
      res.redirect(thetype.url);
    });
   }
};