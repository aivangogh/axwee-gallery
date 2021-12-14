const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const FILE_SIZE = 1024 * 1024 * 3;

const storage = multer.diskStorage({
  //destination for files
  destination: function (req, file, cb) {
    const dir = `./public/uploads/post`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },

  filename: (req, file, cb) => {
    crypto.randomBytes(8, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

// Multer Filter
const filter = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'png') {
    cb(null, true);
  } else if (file.mimetype.split('/')[1] === 'jpeg') {
    cb(null, true);
  } else {
    cb(new Error('File is not in .png or .jpeg format extension.'), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    FILE_SIZE,
  },
});
