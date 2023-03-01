const { v4: uuidv4 } = require("uuid");
const { pool } = require("../db_init");

const ping = async (req, res) => {
  res.status(200).send("Healthy");
};

const addToCart = async (req, res) => {
  const { dish_id, table_id } = req.body;
  const cart_id = uuidv4();
  try {
    const { rowCount } = await pool.query(
      "SELECT * FROM cart WHERE dish_id = $1 AND table_id = $2",
      [dish_id, table_id]
    );

    if (rowCount > 0) {
      return res.status(409).json({
        message: "Item already Added to cart",
      });
    } else {
      const addToCartCommand = await pool.query(
        "INSERT INTO Cart (Cart_id, Dish_id, Quantity, table_id) VALUES ($1, $2, $3, $4) returning *",
        [cart_id, dish_id, 1, table_id]
      );
      if (addToCartCommand.rowCount > 0) {
        const addedcart_id = addToCartCommand.rows[0].cart_id;
        const readAddedDish = await pool.query(
          "SELECT m.dish_id, m.dish_name, m.dish_price, m.dish_image, c.cart_id, c.quantity, c.table_id FROM menu m JOIN cart c ON m.dish_id = c.dish_id WHERE cart_id = $1",
          [addedcart_id]
        );
        return res.status(200).json({
          message: "Added to cart",
          payload: {
            data: readAddedDish.rows[0],
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const increaseDishQuantity = async (req, res) => {
  const { cart_id } = req.body;
  try {
    const { rowCount } = await pool.query(
      "UPDATE cart SET quantity = quantity + 1  WHERE cart_id = $1 returning *",
      [cart_id]
    );
    if (rowCount > 0) {
      const { rowCount, rows } = await pool.query(
        "SELECT m.dish_name, m.dish_price, m.dish_image, c.cart_id,c.quantity FROM menu m JOIN cart c ON m.dish_id = c.dish_id WHERE cart_id=$1",
        [cart_id]
      );
      if (rowCount > 0) {
        res.status(200).json({
          message: "Quantity Increased",
          payload: {
            data: rows[0],
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const decreaseDishQuantity = async (req, res) => {
  const { cart_id } = req.body;
  try {
    const { rowCount } = await pool.query(
      "UPDATE cart SET quantity = quantity - 1  WHERE cart_id= $1 returning *",
      [cart_id]
    );
    if (rowCount > 0) {
      const { rowCount, rows } = await pool.query(
        "SELECT m.dish_name, m.dish_price, m.dish_image, c.cart_id,c.quantity FROM menu m JOIN cart c ON m.dish_id = c.dish_id WHERE cart_id = $1",
        [cart_id]
      );
      if (rowCount > 0) {
        res.status(200).json({
          message: "Quantity Increased",
          payload: {
            data: rows[0],
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const readAllCart = async (req, res) => {
  const { table_id } = req.body;
  try {
    const { rowCount, rows } = await pool.query(
      "SELECT m.dish_name, m.dish_image, m.dish_price, c.cart_id, c.quantity FROM menu m JOIN cart c ON m.dish_id = c.dish_id WHERE table_id = $1",
      [table_id]
    );
    if (rowCount > 0) {
      res.status(200).json({
        message: "Fetched All cart items",
        payload: {
          data: rows,
        },
      });
    } else {
      res.status(404).json({
        message: "No Items in cart",
        payload: {
          data: [],
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const emptyCart = async (req, res) => {
  const { table_id } = req.body;
  try {
    const { rowCount, rows } = await pool.query(
      "DELETE FROM cart WHERE table_id = $1 returning *",
      [table_id]
    );
    if (rowCount > 0) {
      res.status(200).json({
        message: "Cart Emptied",
        data: rows,
      });
    } else {
      res.status(200).json({
        message: "",
        data: rows,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteDish = async (req, res) => {
  const { dish_id, table_id } = req.body;
  try {
    const { rowCount, rows } = await pool.query(
      "DELETE FROM cart WHERE dish_id = $1 AND table_id = $2 returning *",
      [dish_id, table_id]
    );
    if (rowCount > 0) {
      res.status(200).json({
        message: "Dish deleted from cart",
        deletedDish: rows[0],
      });
    } else {
      res.status(404).json({
        message: "Item to be deleted is not present",
        deletedDish: [],
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  ping,
  addToCart,
  increaseDishQuantity,
  decreaseDishQuantity,
  readAllCart,
  emptyCart,
  deleteDish,
};
