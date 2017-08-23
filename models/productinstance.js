var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductInstanceSchema = Schema({
	product: {type: Schema.ObjectId, ref: 'Product',required: true},
	status: {type: String, required: true, enum: ['Available','Maintance','Out of Service'], default: 'Available'},
	due_date: {type: Date, default: Date.now},
});

//Virtual for productinstance's URL
ProductInstanceSchema
.virtual('url')
.get( function (){
	return '/catalog/productinstance/' + this._id;
});

//Export model
module.exports = mongoose.model('ProductInstance',ProductInstanceSchema);