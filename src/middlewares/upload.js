const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { getDestination } = require('../helpers/uploadDest');

const dest = getDestination();

const storage = multer.diskStorage({
  //destination for files
  destination: function (req, file, cb) {
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
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
    fieldSize: 1024 * 1024 * 3,
  },
});
