const { pool } = require("../db_init");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;

const addsubcategory = async (req, res) => {
  const { subcategory_name, category_id } = req.body;
  const subcategory_id = uuidv4();
  const subCategoryImage = req.file.filename;

  try {
    const addSubCategory = await pool.query(
      "INSERT INTO subcategory (subcategory_id, subcategory_name, category_id, subcategory_image) VALUES($1, $2, $3, $4) returning *",
      [subcategory_id, subcategory_name, category_id, subCategoryImage]
    );
    res.status(200).json({
      message: "subcateogry added sucessfully",
      payload: {
        subcategory: addSubCategory.rows[0],
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletesubcategory = async (req, res) => {
  try {
    const selectImageCommand = await pool.query(
      "SELECT subcategory_image FROM subcategory where subcategory_id = $1",
      [req.params.subcategory_id]
    );
    const imageToBeDeleted = selectImageCommand.rows[0].subcategory_image;

    await fs.unlink(`./public/SubCategory_Images/${imageToBeDeleted}`);

    const deletesubcategoryCommand = await pool.query(
      "DELETE FROM subcategory where subcategory_id = $1 returning *",
      [req.params.subcategory_id]
    );
    res.status(200).json({
      message: "subcategory sucessfully deleted",
      payload: {
        subcategory: deletesubcategoryCommand.rows[0],
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatesubcategory = async (req, res) => {
  const { subcategory_name } = req.body;
  try {
    if (req.file) {
      const update_image = req.file.filename;
      console.log(update_image);
      const readPreviousImageCommand = await pool.query(
        "SELECT subcategory_image from subcategory WHERE subcategory_id = $1",
        [req.params.subcategory_id]
      );
      const previous_image = readPreviousImageCommand.rows[0].subcategory_image;
      await fs.unlink(`./public/SubCategory_Images/${previous_image}`);
      const updatesubcategoryCommand = await pool.query(
        "UPDATE subcategory SET subcategory_name = $1, subcategory_image = $2 WHERE subcategory_id = $3 returning *",
        [subcategory_name, update_image, req.params.subcategory_id]
      );

      res.status(200).json({
        message: "subcategory update sucessful",
        payload: {
          subcategory: updatesubcategoryCommand.rows[0],
        },
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const readAllSubCategory = async (req, res) => {
  try {
    const readAllSubCategoryCommand = await pool.query(
      "SELECT * FROM subcategory"
    );
    res.status(200).json({
      message: "Subcategory read sucessful",
      payload: {
        subcategory: readAllSubCategoryCommand.rows,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addsubcategory,
  deletesubcategory,
  updatesubcategory,
  readAllSubCategory,
};
