// This will replace the img path "\public\uploads\post***" into "/uploads/post***"
// it remove the "/public/"

exports.repath = (path) => {
  return path.replace(/[\\]/g, '/').replace(/^\/?[^/]+\//, '/');
};
