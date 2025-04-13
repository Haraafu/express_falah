const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

cloudinary.config(process.env.CLOUDINARY_URL);

const upload = (file, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve("Item not found");
    }
    
    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    cloudinary.uploader.upload(dataUri, { 
      folder: folder 
    }, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
};

module.exports = upload;
