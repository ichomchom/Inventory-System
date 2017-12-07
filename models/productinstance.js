var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var ProductInstanceSchema = Schema({
	product: {type: Schema.ObjectId, ref: 'Product',required: true},
	status: {type: String, required: true, enum: ['Available','Maintance','Out of Service'], default: 'Available'},
	due_date: {type: Date, default: Date.now},
	location: {type: String, required: true},
	assetId: {type: Number, required: true},
	poNum: {type: Number, required: true},
	tag:[{type:Schema.ObjectId, ref:'Tag'}],
	tagNum: {type: Number, required: true},
	manufacturer: {type: String},
	model: {type: String},
	serialId: {type: String},
	version: {type: String},
	productionDate: {type: Date},
	currentCustodianName: {type: String},
	currentCustodianDept: {type: String},
	assetCount: {type: Number},
	currentLocation: {type: String},
	acquistionDate: {type: Date},
	acquistionFund: {type: String},
	acquistionDept: {type: String},
	acquistionProj: {type: String},
	//assetStatus: {type: String, required: true},
	checkedOut: {type: String},
	offsite: {type: String},
	lastInventoryDate: {type: Date, required: true},

});

//Virtual for productinstance's URL
ProductInstanceSchema
.virtual('url')
.get( function (){
	return '/catalog/productinstance/' + this._id;
});

//Virtual format date
ProductInstanceSchema
.virtual('lastInventoryDate_formatted')
.get(function(){
	return moment(this.lastInventoryDate).format('MM/D/YYYY');
});
ProductInstanceSchema
.virtual('due_date_formatted')
.get(function(){
	return moment(this.due_date).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('ProductInstance',ProductInstanceSchema);