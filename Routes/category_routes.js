const router = require("express").Router();
const categoryit = require("../controllers/category");
const { upload } = require("../utils/imgUpload");

router.post(
  "/addcategory",
  upload("Category_Images").single("image"),
  categoryit.addCategory
);
router.get("/readallcategory", categoryit.readAllCategory);
router.delete("/deletecategory/:category_id", categoryit.deleteCategory);

module.exports = router;
