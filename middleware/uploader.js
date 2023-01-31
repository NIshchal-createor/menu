const multer = require("multer");
const path = require("path");

// const upload = multer({
//     dest: 'uploads'
// })

function imageFilter(req, file, cb) {
  var mime_type = file.mimetype.split("/")[0];
  console.log("mime type is", mime_type);
  if (mime_type === "image") {
    cb(null, true);
  } else {
    req.fileTypeError = true;
    cb(null, false);
  }
}

function fileSizeFilter(req, file, cb) {
  // var mime_type = file.mimetype.split('/')[0];
  if (file.size > 209) {
    cb(null, true);
  } else {
    req.fileSizeError = true;
    cb(null, false);
  }
}

const file_storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "file"));
  },
});

module.exports = function (filterType) {
  console.log("filter type is", filterType);
  const MAP_FILTER = {
    image: imageFilter,
  };
  const upload = multer({
    storage: file_storage,
  });
  return upload;
};
