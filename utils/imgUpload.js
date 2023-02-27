const multer = require("multer");
const path = require("path");
const fs = require("fs");

function upload(destination) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = `public/${destination}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const image_name =
          file.fieldname + Date.now() + path.extname(file.originalname);
        callback(null, image_name);
      },
    }),
  });
  return upload;
}

module.exports = { upload };
