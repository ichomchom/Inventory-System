var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema({
	productName: {type: String, required: true},
	type: [{type: Schema.ObjectId, ref: 'Type',required:true}],
	assetId: {type: Number, required: true},
	poNum: {type: Number, required: true},
	tagNum: {type: Number, required: true},
	description: {type: String, required: true},
	manufacturer: {type: String},
	model: {type: String},
	serialId: {type: String},
	version: {type: String},
	productionDate: {type: Date, required: true},
	currentCustodianName: {type: String},
	currentCustodianDept: {type: String, required: true},
	assetCount: {type: Number, required: true},
	currentLocation: {type: String},
	acquistionDate: {type: Date, required: true},
	acquistionFund: {type: String},
	acquistionDept: {type: String, required: true},
	acquistionProj: {type: String, required: true},
	assetStatus: {type: String, required: true},
	checkedOut: {type: String},
	offsite: {type: String},
	lastInventoryDate: {type: Date, required: true},

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