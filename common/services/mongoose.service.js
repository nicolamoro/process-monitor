const config = require('../config/env.config.js');
const mongoose = require('mongoose');

let count = 0;

const options = {
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectWithRetry = () => {
  mongoose.connect(config.dbUri, options).then(() => {
    console.log('MongoDB is connected');
  }).catch((err) => {
    console.log(
        `MongoDB connection unsuccessful, retry after 5 seconds. ${++count}`,
    );
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

exports.mongoose = mongoose;
