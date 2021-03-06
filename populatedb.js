#! /usr/bin/env node


//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Product = require('./models/product')
var Cart = require('./models/cart')
var Order = require('./models/order')
var ProductInstance = require('./models/productinstance')
var Student = require('./models/student')
var Type = require('./models/type')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var carts = []
var orders = []
var productinstances = []
var students = []
var types = []

function productCreate( productName, type, assetId, poNum, tagNum, description,
  manufacturer, model, serialId, version, productionDate, currentCustodianName, currentCustodianDept,
  assetCount, currentLocation, acquistionDate, acquistionFund, acquistionDept, acquistionProj,
  assetStatus, checkedOut, offsite, lastInventoryDate, cb) {
  productdetail = { 
	productName : productName,
	type: type,
    assetId: assetId ,
    poNum: poNum,
    tagNum: tagNum,
    description: description,
    productionDate: productionDate,
    currentCustodianDept: currentCustodianDept,
    assetCount: assetCount,
    acquistionDate: acquistionDate,
    acquistionDept: acquistionDept,
    acquistionProj: acquistionProj,
    assetStatus: assetStatus,
    lastInventoryDate: lastInventoryDate,
  
  }
 
    
  var product = new Product(productdetail);    
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}

function typeCreate(name, cb){
	typedetail = { name: name}
	
	var type = new Type(typedetail);
	
	type.save(function(err){
		if (err){
			cb(err, null)
			return
		}
		console.log('New Type: ' + type);
		types.push(type)
		cb(null,type)
	});
}

function studentCreate(firstName, lastName, studentEmail, coyoteId, cb) {
  studentdetail = {
  firstName:firstName , 
  lastName: lastName, 
  studentEmail: studentEmail,
  coyoteId: coyoteId
  }
 

  var student = new Student(studentdetail);
       
  student.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Student: ' + student);
    students.push(student)
    cb(null, student)
  }  );
}

function orderCreate ( cartId, productId, dateCreated, datePickUp, dateReturn, studentId, status, cb){
  orderdetail = {
    cartId : cartId, 
    productId : productId, 
    studentId : studentId, 
    status : status
  }


  var order = new Order(orderdetail);

  order.save(function (err){
    if(err){
      cb(err, null)
      return
    }
    console.log('New Order: ' + order);
    orders.push(order)
    cb(null, order)
  });
}





function cartCreate( productId, dateAdded, quantity, cb){
  cartdetail = {
  productId : productId,
  quantity : quantity
  }

  var cart = new Cart(cartdetail);

  cart.save(function (err) {
    if(err){
      cb(err,null)
      return
    }
    console.log('New Cart: ' + cart);
    carts.push(cart)
    cb(null, cart)
    });
}


function productInstanceCreate( product, status, due_date, location, cb ){
  productinstancedetail ={
    product: product,
    status: status,
	location: location
  }
  if (due_date != false) productinstancedetail.due_date = due_date
  if (status != false) productinstancedetail.status = status

  var productinstance = new ProductInstance(productinstancedetail);
  productinstance.save(function (err){
    if(err){
      console.log('Error Creating ProductInstance: ' + productinstance);
      cb(err,null)
      return
    }
    console.log('New ProductInstance: ' + productinstance);
    productinstances.push(productinstance)
    cb(null,product)
  });
}



function createTypes(cb){
	async.parallel([
		function(callback){
			typeCreate('Laptop', callback);
		},
		function(callback){
			typeCreate('Chip', callback);
		},
		function(callback){
			typeCreate('Robotic', callback);
		},
	],
	cb);
}
function createProducts(cb) {
    async.parallel([
        function(callback) {
          productCreate( 'Dell', types[0] ,'2', '3', '12','Dell 2013 laptop', 'os','12','13','1.2','10-20-2016','me','CS','2','2',
          '1','0','test','test','available','none','none','10-20-2016', callback);
        },
		function(callback) {
          productCreate( '401 chip', types[1] ,'2', '3', '12','chip for 401 class', 'os','12','13','1.2','10-20-2016','me','CS','2','2',
          '1','0','test','test','available','none','none','10-20-2016', callback);
        },
		function(callback) {
          productCreate( 'Robotic', types[2] ,'2', '3', '12','Robotic materials', 'os','12','13','1.2','10-20-2016','me','CS','2','2',
          '1','0','test','test','available','none','none','10-20-2016', callback);
        },
            function(callback) {
          productCreate( 'Robotic', types[2] ,'2', '3', '12','Robotic materials', 'os','12','13','1.2','10-20-2016','me','CS','2','2',
          '1','0','test','test','available','none','none','10-20-2016', callback);
        },
        ],
        // optional callback
        cb);
}
function createCarts(cb) {
    async.parallel([
        function(callback) {
          cartCreate( products[0], '', '1', callback);
        }
        ],
        // optional callback
        cb);
}

function createStudents(cb) {
    async.parallel([
        function(callback) {
          studentCreate('Patrick', 'Rothfuss', 'dfalfjd@yahoo.com','4564321321', callback);
        }
        ],
        // optional callback
        cb);
}
function createOrders(cb) {
    async.parallel([
        function(callback) {
          orderCreate( carts[0], products[0], '08-23-2017','08-23-2017', '07-15-2019',students[0],'Available', callback);
        }
        ],
        // optional callback
        cb);
}


function createProductInstances(cb) {
    async.parallel([
        function(callback) {
          productInstanceCreate(products[0],'Available','10-20-2017','CSE ITC office',callback);
        },
		function(callback) {
          productInstanceCreate(products[1],'Out of Service','10-20-2017','library',callback);
        },
		function(callback) {
          productInstanceCreate(products[2],'Maintance','10-20-2017','Business Office',callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
	createTypes,
    createProducts,
    createStudents,
    createCarts,
    createOrders,
    createProductInstances,
    ],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ProductInstances: '+productinstances);
        
    }
    //All done, disconnect from database
    mongoose.connection.close();
});




