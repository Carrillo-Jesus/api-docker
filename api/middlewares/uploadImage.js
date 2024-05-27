const fs = require('fs');
const path = require('path');
const multer = require('multer');

const destinationFolders = {
  '/products': 'products',
  '/categories': 'categories',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = Object.keys(destinationFolders)
        .map(route => req.baseUrl.includes(route) ? destinationFolders[route] : null)
          .find(dir => dir !== null);

      const uploadDir = folder ? path.join(__dirname, '..', 'public', 'images', folder) : path.join(__dirname, '..', 'public', 'images');
      fs.mkdirSync(uploadDir, { recursive: true }); // Crear el directorio si no existe
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName);
    },
});

const upload = multer({ storage });

module.exports = upload;