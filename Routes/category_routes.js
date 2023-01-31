const router = require("express").Router();
const categoryit = require("../controllers/category");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Category_Images");
  },
  filename: (req, file, callback) => {
    const image_name =
      file.fieldname + Date.now() + path.extname(file.originalname);
    callback(null, image_name);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/addcategory", upload.single("image"), categoryit.addCategory);
router.get("/readallcategory", categoryit.readAllCategory);
router.delete("/deletecategory/:category_id", categoryit.deleteCategory);

module.exports = router;
