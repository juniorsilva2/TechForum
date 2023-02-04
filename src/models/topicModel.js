const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
});

const TopicModel = mongoose.model("topic", topicSchema);

module.exports = TopicModel;
