var mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let dbname = "Beatwithmusic";
let dbUrl  = `mongodb+srv://Harmit1708:Harmit@cluster0.brz2m.mongodb.net/${dbname}`;
module.exports = {dbUrl,mongodb,MongoClient }