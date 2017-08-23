var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StudentSchema = Schema(
  {
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    studentEmail: {type: String, required: true},
    coyoteId: {type: String, required: true},
  }
);

// Virtual for student's full name
StudentSchema
.virtual('name')
.get(function () {
  return this.lastName + ', ' + this.firstName;
});

// Virtual for student's URL
StudentSchema
.virtual('url')
.get(function () {
  return '/student/' + this._id;
});

//Export model
module.exports = mongoose.model('Student', StudentSchema);