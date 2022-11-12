const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
  slots: [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref: "Slot"
    }
  ],
  level: { type: String, default: "beginner" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Customer = new mongoose.model("Customer", customerSchema);

module.exports = Customer;
