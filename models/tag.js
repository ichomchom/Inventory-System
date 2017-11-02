var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = Schema(
  {
    name: {type: String, required: true, min: 3, max: 100}
  }
);


// Virtual for Type's URL
TagSchema
.virtual('url')
.get(function () {
  return '/catalog/tag/' + this._id;
});

//Export model
module.exports = mongoose.model('Type', TagSchema);