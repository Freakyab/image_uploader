const mongoose = require("mongoose");
const client = require("../config");

const ImageDetailsSchema = new mongoose.Schema(
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

const ImageDetails = client.model("ImageDetails", ImageDetailsSchema);
module.exports = ImageDetails;
