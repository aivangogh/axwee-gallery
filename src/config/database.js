const mongoose = require('mongoose');

const dbString = process.env.MONGODB_URL || 3000;
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const connection = mongoose.connection;
mongoose
  .connect(dbString, dbOptions)
  .then((res) => console.log(`MongoDB Connected...`))
  .catch((err) => console.log(`Error in DB connection: ${err}`));

module.exports = connection;
