const mongoose = require("mongoose");
const client = require("../config");

const ImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Image = client.model("Image", ImageSchema);
module.exports = Image;
