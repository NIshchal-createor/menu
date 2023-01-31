const router = require("express").Router();
const dishit = require("../controllers/menu");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Dish_Images");
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

router.post("/adddish", upload.single("image"), dishit.addDish);

router.get("/readallldish", dishit.readAllDish);
router.get(
  "/readdishwithsubcategory/:subcategory_id",
  dishit.readDishWithSubCategory
);

router.get("/readsubcatgory/:category_id", dishit.readSubCategory);

router.get(
  "readdishwithsubcategory/:subcategory_id",
  dishit.readDishWithSubCategory
);

router.post("/addspecial/:dish_id", dishit.addSpecialDish);
router.get("/readspecial", dishit.readSpecialDish);
router.get("/read-onedish/:dish_id", dishit.readDish);

router.delete("/deletedish/:dish_id", dishit.deleteDish);

router.delete("/deletespecial/:special_id", dishit.deleteSpecialDish);
router.put("/updatedish/:dish_id", upload.single("image"), dishit.updateDish);

router.get("/like", dishit.dish_like);

router.get("/ts", dishit.dish_ts);

module.exports = router;
