const { ObjectId } = require('mongodb');

const mongo = require('../mongo');

const service = {
  async get(req, res) {
    try {
      const data = await mongo.posts
        .find({ userId: req.user.userId })
        .toArray();
      res.send(data);
    } catch (err) {
      console.log('error in GET - ', err);
      res.sendStatus(500);
    }
  },
  async post(req, res) {
    try {
      const data = await mongo.posts.insertOne({
        ...req.body,
        userId: req.user.userId,
      });
      console.log(data);
      res.send({ ...req.body, userId: req.user.userId });
    } catch (err) {
      console.log('error in POST - ', err);
      res.sendStatus(500);
    }
  },
  async put(req, res) {
    try {
      console.log(req.params.id);
      const data = await mongo.posts.findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: { ...req.body } },
        { returnNewDocument: true }
      );
      console.log(data);
      res.send({ ...req.body });
    } catch (err) {
      console.log('error in POST - ', err);
      res.sendStatus(500);
    }
  },
  async delete(req, res) {
    try {
      const post = await mongo.posts.findOne({
        _id: ObjectId(req.params.id),
        userId: req.user.userId,
      });

      if (!post)
        return res
          .status(401)
          .send({ error: 'not allowed to access this post' });

      await mongo.posts.deleteOne({ _id: ObjectId(req.params.id) });
      res.end();
    } catch (err) {
      console.log('error in POST - ', err);
      res.sendStatus(500);
    }
  },
};

module.exports = service;
