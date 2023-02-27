const router = require("express").Router();
const dishit = require("../controllers/menu");
const multer = require("multer");
const path = require("path");
const { upload } = require("../utils/imgUpload");

router.post("/adddish", upload("Dish_Images").single("image"), dishit.addDish);

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
router.put(
  "/updatedish/:dish_id",
  upload("Dish_Images").single("image"),
  dishit.updateDish
);

router.get("/like", dishit.dish_like);

router.get("/ts", dishit.dish_ts);

module.exports = router;
