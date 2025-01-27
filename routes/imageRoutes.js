const express = require("express");
const {
  getImage,
  updateImage,
  deleteImage,
  addImage,
} = require("../controllers/imageControllers");
const upload = require("../config/multerConfig");
const router = express.Router();

router.post("/", upload.single("image"), addImage);
router.get("/:imageId", getImage);
router.put("/:imageId", updateImage);
router.delete("/:imageId", deleteImage);

module.exports = router;
