const mongo = require('mongodb'); // we can also object destructre {MongoClient}

const MongoClient = mongo.MongoClient;
const MONGODB_URL = 'mongodb://localhost:27017';
const MONGODB_NAME = 'guvi_posts';

const client = new MongoClient(MONGODB_URL);

const mongodb = {
  // complete collections
  db: null,

  //   Connection specific to collection
  posts: null,
  users: null,

  async connect() {
    // Connecting to Database
    await client.connect();
    console.log('Connected to Database - ', MONGODB_URL);

    // Selecting the Database
    this.db = client.db(MONGODB_NAME);
    console.log('Selected the Database - ', MONGODB_NAME);

    // Initialize Collections
    this.posts = this.db.collection('posts');
    this.users = this.db.collection('users');
  },
};

module.exports = mongodb;
