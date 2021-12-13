// to make to upload.js middleware usable
/**
 *  @string
 *  @string
 */

const dest = '';

exports.getDestination = () => {
  return dest;
};

exports.setDestination = (dest) => {
  return (dest = dest);
};
