require('dotenv').config();
const mongodb = require('./lib/mongodb');

/* Methods loaded when the service starts */
function boot() {
  mongodb.init(); // initialization MongoDB
  mongodb.connect(process.env.DB_CONNECT_URL); // connect MongoDB
}

module.exports = boot;
