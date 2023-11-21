const TopicModel = require("../models/topicModel");
const UserModel = require("../models/userModel");

const getTopics = async (req, res) => {
  try {
    const topics = await TopicModel.find();
    if (req.user) {
      const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 , id: 1});
      return res.render("topics", { topics, user });
    }
    res.render("topics", { topics, user: null });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

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

module.exports = {
  getTopics,
  createTopic,
};


