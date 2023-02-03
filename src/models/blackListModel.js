const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    expires: 3600,
  },
});

const BlackListModel = mongoose.model("blackList", blackListSchema);

module.exports = BlackListModel;
