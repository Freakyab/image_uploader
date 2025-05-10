const express = require("express");
const cors = require("cors");
const Image = require("./models/image.model"); // Mongoose model
const ImageDetails = require("./models/details.model"); // Mongoose model
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Welcome to the API",
    status: true,
  });
});

app.post("/post", async (req, res) => {
  try {
    const { imageString, title, description, id, size } = req.body;

    if (!imageString || !title || !id) {
      return res.status(400).json({
        message: "Please provide imageString, title and description",
        status: false,
      });
    }

    const image = new Image({ id, imageString, size });
    await image.save();

    const existingImageDetails = await ImageDetails.findOne({ id });
    if (!existingImageDetails) {
      const imageDetails = new ImageDetails({ title, id, description });
      await imageDetails.save();
    }

    return res.status(200).json({
      message: "Image saved successfully",
      status: true,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
});

app.get("/getTotalSize", async (_, res) => {
  try {
    const images = await Image.find();

    const groupedImages = images.reduce((acc, image) => {
      if (!acc[image.id]) acc[image.id] = [];
      acc[image.id].push(image);
      return acc;
    }, {});

    const imagesArray = Object.keys(groupedImages).map((id) => ({
      id,
      chunks: groupedImages[id].length,
    }));

    return res.status(200).json({
      message: "Total size fetched successfully",
      status: true,
      totalImages: imagesArray,
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
});

app.get("/getImages/:chunkNo/:id", async (req, res) => {
  try {
    const { chunkNo, id } = req.params;

    if (!chunkNo || !id) {
      return res
        .status(400)
        .json({ message: "Please provide chunkNo and id", status: false });
    }

    const images = await Image.find({ id });

    if (!images.length || !images[chunkNo]) {
      return res
        .status(404)
        .json({ message: "Image not found", status: false });
    }

    return res.status(200).json({
      message: "Image fetched successfully",
      status: true,
      image: images[chunkNo],
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
});

app.get("/getAllChunks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const images = await Image.find({ id }).sort({ _id: 1 });

    if (!images.length) {
      return res
        .status(404)
        .json({ message: "Image not found", status: false });
    }

    return res.status(200).json({
      message: "Chunks fetched",
      status: true,
      chunks: images.map((img) => img.imageString),
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal error", status: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
