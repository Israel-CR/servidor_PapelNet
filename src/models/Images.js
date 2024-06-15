const { Schema, model } = require("mongoose");


const imageSchema = new Schema({
    filename: String,
    data: Buffer,
    contentType: String,
  });


  module.exports= model("Images", imageSchema)