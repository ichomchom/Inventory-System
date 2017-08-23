var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = Schema({
	cartId: {type: Schema.ObjectId, ref: 'Cart', required: true},
	productId: {type: Schema.ObjectId, ref: 'Product',required: true},
	dateCreated: {type: Date, default: Date.now},
	datePickUp: {type: Date, default: Date.now},
	dateReturn: {type: Date},
	studentId: {type: Schema.ObjectId, ref: 'Student',required:true},
	status: {type: String, required: true},

});

//Virtual for cart URL
OrderSchema
.virtual('url')
.get(function(){
	return '/cart/order/' + this._id;
});

//Export model
module.exports = mongoose.model('Order',OrderSchema);