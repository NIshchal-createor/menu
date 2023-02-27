const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.status(200).send("Healthy");
});
app.use(express.json());
app.use("/category", require("./routes/category_routes"));
app.use("/subcategory", require("./routes/sub-category_routes"));
app.use("/menu", require("./routes/menu_routes"));
app.use("/cart", require("./Routes/cart_routes"));

app.listen(3000, () => {
  console.log("listening to localhost:3000");
});
