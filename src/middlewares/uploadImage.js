const multer = require("multer");
const firebaseStorageService = require("../services/firebase-admin"); // Importar el servicio de Firebase
const dotenv = require("dotenv");
dotenv.config(); 

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10MB

const uploadMiddleware = upload.single("imagen");


const handleUpload = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "El archivo es demasiado grande. El límite es de 10 MB.",
        });
      }
      return res
        .status(500)
        .json({ message: "Error al procesar el archivo", error: err });
    }

    if (!req.file) {
      next();
      return;
    }

    try {
      const imageUrl = await firebaseStorageService.uploadImage(req.file);
      console.log("Imagen subida a Firebase Storage:", imageUrl);

      req.imageUrl = imageUrl;

      next();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      res.status(500).json({
        message: "Error al subir la imagen a Firebase Storage",
        error: error.message,
      });
    }
  });
};

module.exports = handleUpload;



// // uploadMiddleware.js
// const multer = require('multer');
// const Images = require('../models/Images');
// const { default: mongoose } = require('mongoose');

// const storage = multer.memoryStorage()

// const upload = multer({ storage });
// // Configuración de Multer para almacenar archivos en memoria

// const uploadMiddleware = upload.single('imagen');

// const handleUpload = async (req, res, next) => {

//   uploadMiddleware(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Failed to upload file', error: err });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     try {
//       const newImage = new Images({
//         filename: req.file.originalname,
//         data: req.file.buffer,
//         contentType: req.file.mimetype,
//       });

//       const image= await newImage.save();
//       req.image = {id:image._id}; // Guardar la imagen en la solicitud para el siguiente manejador
//       next(); // Pasar al siguiente manejador
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to save file to database', error });
//     }
//   });
// };

// module.exports = handleUpload;
