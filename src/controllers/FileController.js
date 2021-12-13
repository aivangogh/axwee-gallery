const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

// init gfs
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos',
  });
});

exports.uploadFile = (req, res) => {
  if (req.file == undefined) {
    res.send('You must select a file.');
    // req.flash('error_msg', 'You must select a file.');
  }
  const imgUrl = `http://localhost:${process.env.PORT}/file/${req.file.filename}`;
  return res.send(imgUrl);
};

exports.getFile = async (req, res) => {
  try {
    const file = gfs
      .find({
        filename: req.params.filename,
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: 'no files exist',
          });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
  } catch (err) {
    res.send('Image not found.');
    // req.flash('error_msg', 'Image not found.');
  }
};

exports.deleteFile = async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send('Image deleted');
    // req.flash('success_msg', 'Image deleted');
  } catch (err) {
    res.send('An error occured.');
    // req.flash('error_msg', 'An error occured.');
  }
};

exports.renderImage = (req, res) => {
  if (!gfs) {
    console.log('some error occured, check connection to db');
    res.send('some error occured, check connection to db');
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render('index', {
        files: false,
      });
    } else {
      const f = files
        .map((file) => {
          if (
            file.contentType === 'image/png' ||
            file.contentType === 'image/jpeg'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b['uploadDate']).getTime() -
            new Date(a['uploadDate']).getTime()
          );
        });

      return res.render('/partials/render-image', {
        files: f,
      });
    }
  });
};
