// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = /jpeg|jpg|png|pdf/;
//   const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//   const mime = allowed.test(file.mimetype);
//   if (ext && mime) cb(null, true);
//   else cb("Invalid file type", false);
// };

// const upload = multer({ storage, fileFilter });
// module.exports = upload;



const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;  