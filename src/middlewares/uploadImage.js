// uploadMiddleware.js
const multer = require('multer');
const Images = require('../models/Images');
const { default: mongoose } = require('mongoose');


const storage = multer.memoryStorage()

const upload = multer({ storage });
// Configuración de Multer para almacenar archivos en memoria

const uploadMiddleware = upload.single('imagen');


const handleUpload = async (req, res, next) => {
  
  
  uploadMiddleware(req, res, async (err) => {
    console.log(req.file)
    if (err) {
      return res.status(500).json({ message: 'Failed to upload file', error: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const newImage = new Images({
        filename: req.file.originalname,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });

      const image= await newImage.save();
      req.image = {id:image._id}; // Guardar la imagen en la solicitud para el siguiente manejador
      next(); // Pasar al siguiente manejador
    } catch (error) {
      res.status(500).json({ message: 'Failed to save file to database', error });
    }
  });
};

module.exports = handleUpload;
