const mongoose = require("mongoose");
const { Schema } = mongoose;

const CertificateSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  certificateUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Certificate = mongoose.model("certificates", CertificateSchema);
module.exports = Certificate;
