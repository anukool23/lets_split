const mongoose = require("mongoose");
const { types } = require("pg");

const transactionSchema = new mongoose.Schema({
  journeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "journey",
    required: true,
  },
  amount: {
    required: true,
    types: Number,
  },
  user_contribution: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      user_amount: {
        type: Number,
        required: true,
      },
      
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        immutable: true
    },createdAt:{
        type: Date,
        required: true,
        immutable: true
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },updatedAt:{
        type: Date,
        required: true,
    },
});
module.exports = mongoose.model("transcation", transactionSchema);
