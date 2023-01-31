const router = require("express").Router();
const subcategoryit = require("../controllers/subcategory");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/SubCategory_Images");
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

router.post(
  "/addsubcategory",
  upload.single("image"),
  subcategoryit.addsubcategory
);
router.delete(
  "/deletesubcategory/:subcategory_id",
  subcategoryit.deletesubcategory
);

router.patch(
  "/updatesubcategory/:subcategory_id",
  upload.single("image"),
  subcategoryit.updatesubcategory
);

router.get("/readallsubcategory", subcategoryit.readAllSubCategory);
module.exports = router;
