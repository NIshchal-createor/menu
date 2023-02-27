const router = require("express").Router();
const subcategoryit = require("../controllers/subcategory");
const multer = require("multer");
const path = require("path");
const { upload } = require("../utils/imgUpload");

router.post(
  "/addsubcategory",
  upload("SubCategory_Images").single("image"),
  subcategoryit.addsubcategory
);
router.delete(
  "/deletesubcategory/:subcategory_id",
  subcategoryit.deletesubcategory
);

router.patch(
  "/updatesubcategory/:subcategory_id",
  upload("SubCategory_Images").single("image"),
  subcategoryit.updatesubcategory
);

router.get("/readallsubcategory", subcategoryit.readAllSubCategory);
module.exports = router;
