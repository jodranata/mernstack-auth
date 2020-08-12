const mongoose = require('mongoose');

const mongoConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const connectDB = mongoUrl => {
  mongoose.connect(mongoUrl, mongoConfig);
  const db = mongoose.connection;
  db.once('open', _ => console.log(`Database connected on ${db.host}`));
  db.on('close', _ => console.log(`Database is closed`));
  db.on('error', err => console.log(err.message));
};

module.exports = connectDB;
