var express = require('express');
var router = express.Router();

// Require controller modules
var product_controller = require('../controllers/productController');
var product_instance_controller = require('../controllers/productinstanceController');

/// Product ROUTES ///

/* GET catalog home page. */
router.get('/', product_controller.index);

/* GET request for creating a Book. NOTE This must come before routes that display Book (uses id) */
router.get('/product/create', product_controller.product_create_get);

/* POST request for creating Book. */
router.post('/product/create', product_controller.product_create_post);

/* GET request to delete Book. */
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request to delete Book
router.post('/product/:id/delete', product_controller.product_delete_post);

/* GET request to update Book. */
router.get('/product/:id/update', product_controller.product_update_get);

// POST request to update Book
router.post('/product/:id/update', product_controller.product_update_post);

/* GET request for one Book. */
router.get('/product/:id', product_controller.product_detail);

/* GET request for list of all Book items. */
router.get('/products', product_controller.product_list);

/// PRODUCTINSTANCE ROUTES ///

/* GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id) */
router.get('/productinstance/create', product_instance_controller.productinstance_create_get);

/* POST request for creating BookInstance. */
router.post('/productinstance/create', product_instance_controller.productinstance_create_post);

/* GET request to delete BookInstance. */
router.get('/productinstance/:id/delete', product_instance_controller.productinstance_delete_get);

// POST request to delete BookInstance
router.post('/productinstance/:id/delete', product_instance_controller.productinstance_delete_post);

/* GET request to update BookInstance. */
router.get('/productinstance/:id/update', product_instance_controller.productinstance_update_get);

// POST request to update BookInstance
router.post('/productinstance/:id/update', product_instance_controller.productinstance_update_post);

/* GET request for one BookInstance. */
router.get('/productinstance/:id', product_instance_controller.productinstance_detail);

/* GET request for list of all BookInstance. */
router.get('/productinstances', product_instance_controller.productinstance_list);

module.exports = router;