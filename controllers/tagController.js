var Tag = require('../models/tag');
var Type = require('../models/type');
var Product = require('../models/product');
var ProductInstance = require('../models/productinstance');

var async = require('async');

// Display list of all Tag
exports.tag_list = function(req, res, next) {
    Tag.find()
	.sort([['name','ascending']])
	.exec(function (err, list_tags) {
			if (err) { return next(err);}
			//Successful, render
			res.render('tag_list',{ title: 'Tag List', tag_list: list_tags});
		});
};

// Display detail page for a specific Tag


exports.tag_detail = function(req, res, next) {

  async.parallel({
    tag: function(callback) {  
      Tag.findById(req.params.id)
        .exec(callback);
    },
        
    tag_products: function(callback) {            
      ProductInstance.find({ 'tag': req.params.id })
      .exec(callback);
    },
        list_products: function(callback) {  
        ProductInstance.find('product tag').populate('product').exec(callback);
    },
    product : function(callback){
        ProductInstance.findById(req.params.id)
        .populate('tag')
        .exec(callback);
      },

  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('tag_detail', { title: 'Tag Detail',product_list: results.list_products, product: results.product, tag: results.tag, tag_products: results.tag_products } );
  });

};



// Display Tag create form on GET
exports.tag_create_get = function(req, res, next) {
    res.render('tag_form',{title:'Create Tag'});
};

// Handle Tag create on POST
exports.tag_create_post = function(req, res, next) {
    
    //Check that the name of the field is not empty
    req.checkBody('name', 'Tag name required').notEmpty();

    //Trim and escape name field.
    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a tag object with escaped and trimmed data.
    var tag = new Tag(
      {name: req.body.name}
      );

    if(errors){
      //If there are errors render the form again, passing the previously entered values and errors
      res.render('tag_form',{title:'Create Tag', tag: tag, errors: errors});
      return;
    }
    else{
      //Data is valid
      //Check if Tag with the same name already exists

      Tag.findOne({'name' : req.body.name})
        .exec (function(err,found_tag){
          console.log('found_tag: ' + found_tag);
          if(err){return next(err);}

          if(found_tag){
            //Tag exists, redirect to detail page
            res.redirect(found_tag.url);
          }
          else {
            tag.save(function(err){
              if (err) {return next(err);}
              //Tag saved. Redirect to tag detail page
              res.redirect(tag.url);
            });
          }
        });
    }
};

// Display Tag delete form on GET
exports.tag_delete_get = function(req, res, next) {
    async.parallel({
      tag: function(callback) {
        Tag.findById(req.params.id).exec(callback);
      },
      tag_products: function(callback) {
        ProductInstance.find({'tag': req.params.id}).exec(callback);
      },
      product : function(callback){
        ProductInstance.findById(req.params.id)
        .populate('product')
        .exec(callback);
      },
    }, function(err, results){
      if(err) {return next(err);}
      //Successful, render
      res.render('tag_delete', {title:'Delete Tag',products: results.product, tag: results.tag, tag_products:results.tag_products});
    });
};

// Handle Tag delete on POST
exports.tag_delete_post = function(req, res, next) {
    
    req.checkBody('id', 'Tag id must be exist').notEmpty();

    async.parallel({
      tag: function(callback) {
        Tag.findById(req.params.id).exec(callback);
      },
      tag_products: function(callback){
        ProductInstance.find({'tag': req.params.id},'product description').exec(callback);
      },
      product : function(callback){
        ProductInstance.findById(req.params.id)
        .populate('product')
        .exec(callback);
      },
    }, function(err,results){
      if (err) {return next(err);}
      //success
      if (results.tag_products.length > 0) {
        //Tag has products. Render as get route
            res.render('tag_delete', { title: 'Delete Tag',products: results.product, tag: results.tag, tag_products: results.tag_products } );
        return;
      }
      else{
        Tag.findByIdAndRemove(req.body.id, function deleteTag(err){
          if(err) {return next(err);}
          res.redirect('/catalog/tags');
        })
      }
    });
};

// Display Tag update form on GET
exports.tag_update_get = function(req, res, next) {

  req.sanitize('id').escape();
  req.sanitize('id').trim();

  Tag.findById(req.params.id, function(err,tag){
    if(err) {return next(err);}
    //success
    res.render('tag_form', {title: 'Update Tag', tag: tag});
  });

};

// Handle Tag update on POST
exports.tag_update_post = function(req, res, next) {

   //Escape the field
   req.sanitize('id').escape();
   req.sanitize('id').trim();


     //Check name is not empty
   req.checkBody('name', 'Tag name required').notEmpty();

   //Trim the field
   req.sanitize('name').escape();
   req.sanitize('name').trim();

   var errors = req.validationErrors();

   //Create Tag object with escaped and trimmed data
   var tag = new Tag({
    name: req.body.name,
    _id: req.params.id
  });

   if(errors){
    res.render('tag_form',{title: 'Update Tag', tag:tag, errors: errors});
    return;
   }
   else{
    Tag.findByIdAndUpdate(req.params.id, tag, {}, function(err,thetag){
      if (err){ return next(err);}
      res.redirect(thetag.url);
    });
   }
};