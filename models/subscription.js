const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  startDate: { type: Date, require: true },
  endDate: { type: Date, require: true },
  paymentMethod: { type: String, require: true },
  amountPaid: { type: Number, default: 0 },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const Subscription = new mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
