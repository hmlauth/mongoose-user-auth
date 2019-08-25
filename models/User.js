var mongoose = require("mongoose");

delete mongoose.connection.models['user'];

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  uuid: {
    type: String
  },
  username: {
    type: String,
    trim: true,
    required: "Username is Required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    validate: [
      function(input) {
        return input.length >= 6;
      },
      "Password should be longer."
    ]
  },
  hashPassword: {
    type: String,
    unique: true
  },
  userCreated: {
    type: Date,
    default: Date.now
  }
});

let User = mongoose.model("user", UserSchema);

module.exports = User;
