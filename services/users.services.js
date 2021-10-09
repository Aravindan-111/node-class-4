const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongo = require('../mongo');

const service = {
  async register(req, res) {
    try {
      // check email exists
      const data = await mongo.users.findOne({ email: req.body.email });
      if (data) return res.status(400).send({ error: 'user already exist' });

      //   Generate Salt & hash
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      //   console.log(newPass);

      //

      // insert user
      await mongo.users.insertOne(req.body);

      res.send({ message: 'User registered successfully' });
    } catch (err) {
      console.log('error in Registering - ', err);
      res.sendStatus(500);
    }
  },
  async login(req, res) {
    try {
      // check email exists
      const data = await mongo.users.findOne({ email: req.body.email });
      if (!data) return res.status(400).send({ error: 'email doesnt exist' });

      //   check password
      console.log(data);
      const isValid = await bcrypt.compare(req.body.password, data.password);
      if (!isValid) return res.status(403).send({ error: 'User login Failed' });

      // Generate Token
      const token = jwt.sign({ userId: data._id, email: data.email }, 'gu@$vi');

      res.send({ token });
    } catch (err) {
      console.log('error in login User - ', err);
      res.sendStatus(500);
    }
  },
};

module.exports = service;
