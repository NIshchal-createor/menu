const { pool } = require("../db_init");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;

const addDish = async (req, res) => {
  try {
    const { dish_name, dish_price, category_id, subcategory_id, description } =
      req.body;
    const dish_id = uuidv4();
    const dish_image = req.file.filename;
    const addDishCommand = await pool.query(
      "INSERT INTO menu (dish_id, dish_name, dish_price, description, dish_image, category_id, subcategory_id) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *",
      [
        dish_id,
        dish_name,
        dish_price,
        description,
        dish_image,
        category_id,
        subcategory_id,
      ]
    );
    if (addDishCommand.rowCount > 0) {
      res.status(200).json({
        message: "Dish Created",
        payload: {
          dish: addDishCommand.rows[0],
        },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const readAllDish = async (req, res) => {
  try {
    let { page, offset } = req.query;
    let previousPage = false;
    let nextPage = false;
    const readDishCommand = await pool.query(
      "SELECT m.dish_id, m.dish_name, m.dish_price, m.description, m.dish_image, c.category_name, s.subcategory_name FROM menu m JOIN subcategory s ON m.subcategory_id = s.subcategory_id JOIN category c ON s.category_id = c.category_id  LIMIT $2 OFFSET (($1-1)*$2)",
      [page, offset]
    );
    previousPage = page > 1 ? true : false;
    let readnextDishCommand = await pool.query(
      "SELECT m.dish_id, m.dish_name, m.dish_price, m.description, m.dish_image, c.category_name, s.subcategory_name FROM menu m JOIN subcategory s ON m.subcategory_id = s.subcategory_id JOIN category c ON s.category_id = c.category_id LIMIT $2 OFFSET (($1-0)*$2)",
      [page, offset]
    );

    nextPage = readnextDishCommand.rows.length > 0 ? true : false;

    res.status(200).json({
      message: "Read Menu Successful",
      payload: {
        pageNo: page,
        isNextPage: nextPage,
        isPreviousPage: previousPage,
        dish: readDishCommand.rows,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const readSubCategory = async (req, res) => {
  try {
    const readSubCategoryCommand = await pool.query(
      "SELECT subcategory_name , subcategory_id, subcategory_image FROM subcategory WHERE category_id = $1",
      [req.params.category_id]
    );
    if (readSubCategoryCommand.rowCount > 0) {
      res.status(200).json({
        message: "Subcateogry fetched",
        payload: {
          subcategory: readSubCategoryCommand.rows,
        },
      });
    } else {
      res.status(404).json({
        message: "No subcateogory found",
        payload: {
          subcategory: [],
        },
      });
    }
  } catch (error) {
    res.status(200).json(error);
  }
};

const readDishWithSubCategory = async (req, res) => {
  try {
    // Reading dish according to sub category..
    const readDishCommand = await pool.query(
      "SELECT dish_name, dish_price, dish_id, dish_image, description FROM menu WHERE subcategory_id = $1 ",
      [req.params.subcategory_id]
    );

    if (readDishCommand.rowCount > 0) {
      res.status(200).json({
        message: "Subcateogry fetched",
        payload: {
          dish: readDishCommand.rows,
        },
      });
    } else {
      res.status(404).json({
        message: "No dish Found",
        payload: {
          dish: [],
        },
      });
    }
  } catch (error) {
    res.status(200).json(error);
  }
};

const deleteDish = async (req, res) => {
  try {
    const selectImageCommand = await pool.query(
      "SELECT dish_image FROM menu WHERE dish_id = $1",
      [req.params.dish_id]
    );
    const imageToBeDeleted = selectImageCommand.rows[0].dish_image;
    await fs.unlink(`./public/Dish_Images/${imageToBeDeleted}`);
    const deleteDishCommand = await pool.query(
      "DELETE FROM  menu where dish_id=$1 returning *",
      [req.params.dish_id]
    );
    if (deleteDishCommand.rowCount > 0) {
      res.status(200).json({
        message: "Dish Deleted",
        payload: {
          dish: deleteDishCommand.rows[0],
        },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateDish = async (req, res) => {
  try {
    const { dish_name, dish_price, description } = req.body;

    const dish_image = req.file.filename;
    if (req.file) {
      const selectImageCommand = await pool.query(
        "SELECT dish_image FROM menu WHERE dish_id = $1",
        [req.params.dish_id]
      );
      const imageToBeDeleted = selectImageCommand.rows[0].dish_image;

      await fs.unlink(`./public/Dish_Images/${imageToBeDeleted}`);
      const updateDishCommand = await pool.query(
        "UPDATE menu SET dish_name =$1, dish_price=$2, dish_image=$3, description=$4 returning *",
        [dish_name, dish_price, dish_image, description]
      );

      res.status(200).json({
        message: "Dish Updated",
        payload: {
          dish: updateDishCommand.rows[0],
        },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const readSpecialDish = async (req, res) => {
  try {
    const readSpecialCommand = await pool.query(
      "SELECT m.dish_name, m.dish_price, m.dish_image, m.description, sd.specialdish_id, s.subcategory_name, c.category_name FROM menu m JOIN specialdish sd ON sd.dish_id = m.dish_id JOIN subcategory s ON m.subcategory_id = s.subcategory_id JOIN category c ON s.category_id = c.category_id"
    );

    res.status(200).json({
      message: "Special Dish read sucessful",
      payload: {
        dish: readSpecialCommand.rows,
      },
    });
  } catch (error) {
    res.status(200).json(error);
  }
};

const deleteSpecialDish = async (req, res) => {
  try {
    const deleteSpecialDish = await pool.query(
      "DELETE FROM specialdish WHERE specialdish_id = $1 returning *",
      [req.params.special_id]
    );
    if (deleteSpecialDish.rowCount > 0) {
      res.status(200).json({
        message: "Special Dish Deleted",
        payload: {
          deletedDish: deleteSpecialDish.rows[0],
        },
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const addSpecialDish = async (req, res) => {
  const special_id = uuidv4();
  try {
    const checkSpecialCount = await pool.query(
      "SELECT COUNT(*) FROM specialdish"
    );

    if (checkSpecialCount.rows[0].count <= 4) {
      const checkSpecial = await pool.query(
        "SELECT COUNT(*) FROM specialdish WHERE dish_id = $1",
        [req.params.dish_id]
      );
      if (checkSpecial.rows[0].count <= 0) {
        const addSpecialCommand = await pool.query(
          "INSERT INTO specialdish (specialdish_id, dish_id) VALUES($1, $2) returning *",
          [special_id, req.params.dish_id]
        );
        if (addSpecialCommand.rowCount > 0) {
          res.status(200).json({
            message: "Special item added sucessfully",
            payload: {
              dish: addSpecialCommand.rows[0],
            },
          });
        }
      } else {
        res.status(400).json("You have already added this item");
      }
    } else {
      res.status(400).json("Cannot add more than 4 items in special");
    }

    // console.log(addSpecialCommand);
    res.status(200).json("Entered This route");
  } catch (error) {
    res.status(500).json(error);
  }
};

const readDish = async (req, res) => {
  try {
    const readDish = await pool.query("select * from menu where dish_id=$1", [
      req.params.dish_id,
    ]);
    if (readDish.rowCount > 0) {
      res.status(200).json({
        message: "Dish Read Successful",
        payload: {
          dish: readDish.rows[0],
        },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const dish_like = async (req, res) => {
  try {
    let { page, offset } = req.query;
    let previousPage = false;
    let nextPage = false;
    const readDish = await pool.query(
      "select * from dish where dish_name LIKE '%' || $3 || '%' LIMIT $2 OFFSET (($1-1)*$2)",
      [page, offset, req.body.text]
    );
    // console.log(page)
    previousPage = page > 1 ? true : false;
    let readnextDish = await pool.query(
      "select * from dish where dish_name LIKE '%' || $3 || '%' LIMIT $2 OFFSET (($1-0)*$2)",
      [page, offset, req.body.text]
    );
    // console.log(readnextPurchase)
    nextPage = readnextDish.rows.length > 0 ? true : false;
    res.status(200).json({
      message: "Read Successful",
      payload: {
        pageNo: page,
        isNextPage: nextPage,
        isPreviousPage: previousPage,
        data: readDish.rows,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const dish_ts = async (req, res) => {
  try {
    const readDish = await pool.query(
      "SELECT * from dish where dish_idx @@ to_tsquery($1)",
      [req.body.text]
    );

    res.status(200).json({
      message: "Dish searched",
      payload: {
        dish: readDish.rows,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addDish,
  readAllDish,
  readSubCategory,
  deleteDish,
  updateDish,
  readDish,
  deleteSpecialDish,
  readSpecialDish,
  addSpecialDish,
  readDishWithSubCategory,
  dish_like,
  dish_ts,
};
