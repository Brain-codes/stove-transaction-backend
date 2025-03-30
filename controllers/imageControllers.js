const { uploadToDrive, deleteFromDrive } = require("../utils/driveUpload");
const Image = require("../models/Image");
const formatResponse = require("../utils/formatResponse");

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

    // Delete from Google Drive
    await deleteFromDrive(image.public_id);

    // Delete from database
    await image.deleteOne();

    res.status(200).json(formatResponse(200, "Image deleted successfully"));
  } catch (error) {
    res.status(500).json(formatResponse(500, "Error deleting image", error));
  }
};

exports.addImage = async (req, res) => {
  try {
    const { file, body } = req;
    const { folderName } = body;

    const folderMap = {
      stoveImage: "Stove Images",
      agreementImage: "Agreement Images",
      others: "Other Images",
    };

    if (!folderName || !folderMap[folderName]) {
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
      return res.status(400).json(formatResponse(400, "No image provided"));
    }

    // Upload to Google Drive with proper folder name
    const fileName = `${Date.now()}_${file.originalname}`;
    const driveResponse = await uploadToDrive(
      file.buffer,
      fileName,
      file.mimetype,
      folderMap[folderName] // Use mapped folder name
    );

    // Save to database
    const newImage = new Image({
      public_id: driveResponse.fileId,
      url: driveResponse.url,
    });

    const savedImage = await newImage.save();
    res
      .status(201)
      .json(formatResponse(201, "Image added successfully", savedImage));
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json(formatResponse(500, "Error adding image", error));
  }
};
