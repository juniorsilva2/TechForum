const TopicModel = require("../models/topicModel");

const createTopic = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(404).json({ message: "Fields missing" });

    const topicExist = await TopicModel.findOne({ name: name });
    if (topicExist)
      return res.status(422).json({ message: "This topic already exists" });

    await TopicModel.create({ name });

    const topic = await TopicModel.findOne({ name: name });
    res.status(200).json({ message: "Topic sucessfully created", topic });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getTopic = async (req, res) => {
  try {
    const topic = await TopicModel.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(topic);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getTopics = async (req, res) => {
  try {
    const topics = await TopicModel.find();
    if (topics.length === 0)
      return res.status(404).json({ message: "No topic found" });
    res.status(200).json(topics);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(404).json({ message: "Fields missing" });

    const topic = await TopicModel.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    await TopicModel.findByIdAndUpdate(req.params.id, req.body);
    const topicUpdated = await TopicModel.findById(req.params.id);
    res
      .status(200)
      .json({ message: "Topic successfully updated", topicUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topic = await TopicModel.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    await TopicModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Topic successfully deleted", topic });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

module.exports = {
  createTopic,
  getTopic,
  getTopics,
  updateTopic,
  deleteTopic,
};
