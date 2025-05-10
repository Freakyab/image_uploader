const mongoose = require("mongoose");
const client = require("../config");

const ImageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    imageString: {
      type: String,
      required: true,
    },
    size : {
      type: Number,
      required: true,
    },
  }
);

const Image = client.model("Image", ImageSchema);
module.exports = Image;
