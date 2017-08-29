var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TypeSchema = Schema(
  {
    name: {type: String, required: true, max: 100}
  }
);

//Virtual for detail
TypeSchema
.virtual('detail')
.get(function () {
  return ' ' + this.name;
});

// Virtual for Type's URL
TypeSchema
.virtual('url')
.get(function () {
  return '/type/' + this._id;
});

//Export model
module.exports = mongoose.model('Type', TypeSchema);