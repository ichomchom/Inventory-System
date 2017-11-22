var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema({
	productName: {type: String, required: true},
	type: [{type: Schema.ObjectId, ref: 'Type'}],
	description: {type: String, required: true},

});

/*
//virtual for product name
ProductSchema
.virtual('descriptions')
.get(function () {
	return this.description;
});
*/

//Virtual for Product's URL
ProductSchema
.virtual('url')
.get(function (){
	return '/catalog/product/' + this._id;
});

//Export model
module.exports = mongoose.model('Product', ProductSchema);