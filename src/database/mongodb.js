const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectToDatabase = async () => {
  await mongoose.connect(
    // Connection to MongoDB Atlas. Commit this line bellow if you want to connect locally
    // `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@techforum.snedsy4.mongodb.net/?retryWrites=true&w=majority`,
    
    // Connection to MongoDB Locally.
    `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    // Uncommit this line above if you want to connect locally, also change the environment variables to yours 
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