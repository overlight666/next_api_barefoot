const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});
// const db = mongoose.db("Uploads");
module.exports = mongoose.models.Image || mongoose.model("Image", imageSchema);