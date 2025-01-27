const cloudinary = require("../config/cloudinaryConfig");
const Image = require("../models/Image");
const formatResponse = require("../utils/formatResponse");
const upload = require("../config/multerConfig");

exports.updateImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { newImage } = req.body; // Expecting newImage to be a base64 string

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json(formatResponse(404, "Image not found"));
    }

    // Delete the old image from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Check if newImage is provided
    if (!newImage) {
      return res.status(400).json(formatResponse(400, "No new image provided"));
    }

    // Upload the new image to Cloudinary
    const newImageResponse = await cloudinary.uploader.upload(newImage, {
      folder: "your_folder_name",
      resource_type: "image", // Specify resource type
    });

    // Update the image details in the database
    image.public_id = newImageResponse.public_id;
    image.url = newImageResponse.secure_url;
    await image.save();

    res
      .status(200)
      .json(formatResponse(200, "Image updated successfully", image));
  } catch (error) {
    res.status(500).json(formatResponse(500, "Error updating image", error));
  }
};

exports.getImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json(formatResponse(404, "Image not found"));
    }

    res
      .status(200)
      .json(formatResponse(200, "Image retrieved successfully", image));
  } catch (error) {
    res.status(500).json(formatResponse(500, "Error retrieving image", error));
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json(formatResponse(404, "Image not found"));
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete image from database
    await image.remove();

    res.status(200).json(formatResponse(200, "Image deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(500, "Error deleting image", error));
  }
};

exports.addImage = async (req, res) => {
  try {
    const { file, body } = req; // Get the uploaded file and body from the request
    const { folderName } = body; // Extract folder name from the request body

    console.log("Received image file:", file); // Log the received image file
    console.log("Folder name:", folderName); // Log the folder name

    // Define allowed folder names
    const allowedFolders = ["others", "stoveImage", "agreementImage"];

    // Validate folder name
    if (!folderName || !allowedFolders.includes(folderName)) {
      console.log("Invalid folder name provided"); // Log if the folder name is invalid
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Folder name must be one of: others, stoveImage, agreementImage"
          )
        );
    }

    if (!file) {
      console.log("No image provided"); // Log if no image is provided
      return res.status(400).json(formatResponse(400, "No image provided"));
    }

    // Upload the image file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName, // Use the provided folder name
        resource_type: "image", // Specify resource type
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error); // Log the error
          return res
            .status(500)
            .json(
              formatResponse(500, "Error uploading image to Cloudinary", error)
            );
        }

        // Log the successful upload response
        console.log("Image uploaded successfully:", result);

        // Save the image details in the database
        const newImage = new Image({
          public_id: result.public_id,
          url: result.secure_url,
        });

        await newImage.save();
        res
          .status(201)
          .json(formatResponse(201, "Image added successfully", newImage));
      }
    );

    // Use the buffer from the uploaded file
    uploadStream.end(file.buffer);
  } catch (error) {
    console.error("Error adding image:", error); // Log the error
    res.status(500).json(formatResponse(500, "Error adding image", error));
  }
};
