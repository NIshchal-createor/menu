const { pool } = require("../db_init");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;

const addCategory = async (req, res) => {
  const { category_name } = req.body;
  const category_image = req.file.filename;
  const category_id = uuidv4();
  try {
    const addCategoryComamnd = await pool.query(
      "INSERT INTO category (category_id, category_name, category_image) VALUES ($1, $2, $3) returning *",
      [category_id, category_name, category_image]
    );
    res.status(200).json({
      message: "Category add sucessful",
      payload: {
        category: addCategoryComamnd.rows[0],
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const selectImageCommand = await pool.query(
      "SELECT category_image FROM category where category_id = $1",
      [req.params.category_id]
    );
    const imageToBeDeleted = selectImageCommand.rows[0].category_image;
    await fs.unlink(`./public/Category_Images/${imageToBeDeleted}`);
    const deletecategoryCommand = await pool.query(
      "DELETE FROM category where category_id = $1 returning *",
      [req.params.category_id]
    );
    res.status(200).json({
      message: "Category deleted Sucessfully",
      payload: {
        category: deletecategoryCommand.rows[0],
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const readAllCategory = async (req, res) => {
  try {
    const readAllCommand = await pool.query("SELECT * FROM category ");
    res.status(200).json({
      message: "Category read sucessful",
      payload: {
        category: readAllCommand.rows,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { addCategory, deleteCategory, readAllCategory };
