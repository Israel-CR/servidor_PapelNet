// uploadMiddleware.js
const multer = require('multer');
const Images = require('../models/Images');
const { default: mongoose } = require('mongoose');

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.single('imagen');

const handleUploadEdit = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to upload file', error: err });
    }

    const {oldImageId} = req.body;
    if (oldImageId==='null' && !req.file) {
      req.image = { id: null };
      return next();
    }

    try {
      let image;
      // Si se proporciona un ID
      // si el id no es de tipo null

      if (oldImageId!=='null' ) {
        
        
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(oldImageId)) {
          return res.status(400).json({ message: 'Invalid ID' });
        }
        // Buscar la imagen existente
        image = await Images.findById(oldImageId);

        // Si la imagen no existe, devolver un error
        if (!image) {
          return res.status(404).json({ message: 'Image not found' });
        }
        // Si se proporciona un archivo, actualizar la imagen existente
        if (req.file) {
          image.filename = req.file.originalname;
          image.data = req.file.buffer;
          image.contentType = req.file.mimetype;
          await image.save();
        }
      } else {
        // Si no se proporciona un ID pero se proporciona un archivo, actualizar los datos de la
        const newImage = new Images({
          filename: req.file.originalname,
          data: req.file.buffer,
          contentType: req.file.mimetype,
          
        });

        image = await newImage.save();
      }

      // Guardar la imagen en la solicitud para el siguiente manejador
      req.image = { id: image._id };
      next(); // Pasar al siguiente manejador
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to save file to database', error });
    }
  });
};

module.exports = handleUploadEdit;
