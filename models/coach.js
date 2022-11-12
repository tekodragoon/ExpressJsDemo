const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({
  discipline: { type: String, default: "Multisport" },
  bio: { type: String, default: "No bio for this coach" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slots: [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Slot"
    }
  ]
});

const Coach = new mongoose.model("Coach", coachSchema);

module.exports = Coach;
