import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    comment: { type: String, required: 'Please insert a comment' },
    // post reference to add
});