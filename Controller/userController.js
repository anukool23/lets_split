const UserModel = require('../Models/user.model');
const mongoose = require('mongoose');
const dateGenerator = require('../Utils/commonUtils');
const encryptPassword = require('../Utils/utils');
const comparePassword = require('../Utils/utils');
const tokenGeneration = require('../Utils/utils');

async function createUser(req, res) {
    const payload = req.body
    payload.joining_DatenTime= dateGenerator()
    payload.password =await encryptPassword(payload.password)
  try {
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();
    console.log(`User saved to DB ${savedUser}`);
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
    createUser
}