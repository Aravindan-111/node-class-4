const express = require('express');
const mongo = require('./mongo');
const jwt = require('jsonwebtoken');

const postRoutes = require('./routs/posts.routes');
const userRoutes = require('./routs/users.routes');

const app = express();

(async () => {
  // IIFE is used, we can also use arrow or normal function
  try {
    // Connection to MongoDB
    await mongo.connect();

    // Middleware to Parse request body into JSON format
    app.use(express.json());

    // Logging Middleware
    app.use((req, res, next) => {
      console.log('Logging middleware called !!');
      next();
    });

    // Routes

    app.use('/users', userRoutes);

    //  Auth Token Response
    app.use((req, res, next) => {
      const token = req.headers['auth-token'];
      if (token) {
        try {
          req.user = jwt.verify(token, 'gu@$vi');
          console.log(req.user);
          next();
        } catch (err) {
          console.log('token doesnt match');
          res.sendStatus(401);
        }
      } else {
        console.log('token doesnt exist');
        res.sendStatus(401);
      }
    });

    app.use('/posts', postRoutes);

    // Server Start
    app.listen(3001, () => console.log('server running at port 3001'));
  } catch (err) {
    console.log('Error in Connecting', err);
  }
})();
