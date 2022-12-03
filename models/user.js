const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: { type : String, require: true},
  firstName: {type : String, require: true },
  lastName: {type : String, require: true },
  token: {type: String, require: true},
  salt: {type: String, require: true},
  hash: {type: String, require: true},
  birthdate: {type : Date, require: true },
  role: {type: String, default : "customer"},
  customerId: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
  coachId: {type: mongoose.Schema.Types.ObjectId, ref: "Coach"},
});

const User = new mongoose.model("User", userSchema);

module.exports = User;