const router = require("express").Router();
const cartit = require("../Controllers/cart");

router.get("/ping", cartit.ping);
router.post("/addtocart", cartit.addToCart);
router.patch("/increasequantity", cartit.increaseDishQuantity);
router.patch("/decreasequantity", cartit.decreaseDishQuantity);
router.get("/readallcart", cartit.readAllCart);
router.delete("/emptycart", cartit.emptyCart);
router.delete("/removedish", cartit.deleteDish);

module.exports = router;
