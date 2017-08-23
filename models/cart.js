var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CartSchema = Schema({
	productId: {type: Schema.ObjectId, ref: 'Product',required: true},
	dateAdded: {type: Date, default: Date.now},
	quantity: {type: Number, required: true}

});

//Virtual for cart URL
CartSchema
.virtual('url')
.get(function(){
	return '/cart/' + this._id;
});

//Export model
module.exports = mongoose.model('Cart',CartSchema);