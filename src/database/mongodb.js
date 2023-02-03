const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@techforum.snedsy4.mongodb.net/?retryWrites=true&w=majority`,
    (error) => {
      if (error) {
        return console.log(
          `Something gone wrong while connecting to database: ${error}`
        );
      }
      return console.log("Database successfully connected");
    }
  );
};

module.exports = connectToDatabase;
