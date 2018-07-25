const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Open json database
const adapter = new FileSync('db/db.json');
const db = low(adapter);

// Set some defaults (required if JSON file is empty)
db.defaults({ quotes: [] }).write();

module.exports = db;