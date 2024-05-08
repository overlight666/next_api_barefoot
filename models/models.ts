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
  event_id: {
    type: String,
    required: false,
  }
});

const eventSchema = new mongoose.Schema({
    name: String,
    eventId: String,
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
});

const MyImage = mongoose.models.Image || mongoose.model("Image", imageSchema);
const EventLocation = mongoose.models.Coordinates || mongoose.model('Coordinates', eventSchema); 
// const db = mongoose.db("Uploads");
module.exports = { 
    MyImage, EventLocation
}
