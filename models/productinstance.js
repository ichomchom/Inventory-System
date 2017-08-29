var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var ProductInstanceSchema = Schema({
	product: {type: Schema.ObjectId, ref: 'Product',required: true},
	status: {type: String, required: true, enum: ['Available','Maintance','Out of Service'], default: 'Available'},
	due_date: {type: Date, default: Date.now},
	location: {type: String, required: true},
});

//Virtual for productinstance's URL
ProductInstanceSchema
.virtual('url')
.get( function (){
	return '/catalog/productinstance/' + this._id;
});

//Virtual format date
ProductInstanceSchema
.virtual('due_date_formatted')
.get(function(){
	return moment(this.due_date).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('ProductInstance',ProductInstanceSchema);