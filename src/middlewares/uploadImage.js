const multer = require('multer');
const ImgBBService = require('../services/ImgBBService'); // Importar el servicio
const dotenv = require('dotenv');
dotenv.config(); // Cargar las variables de entorno desde el archivo .env

// Configurar almacenamiento de Multer (en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limite de 10MB

const uploadMiddleware = upload.single('imagen');

// Middleware para subir imagen a ImgBB
const handleUpload = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'El archivo es demasiado grande. El límite es de 10 MB.' });
      }
      return res.status(500).json({ message: 'Error al procesar el archivo', error: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    try {
      // Instanciamos ImgBBService con la clave API
      const imgBBService = new ImgBBService(process.env.IMGBB_API_KEY);

      // Subir la imagen a ImgBB y obtener la URL
      const imageUrl = await imgBBService.uploadImage(req.file);

      // Guardamos la URL de la imagen subida en `req`
      req.imageUrl = imageUrl;

      // Pasamos al siguiente middleware o controlador
      next();
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      res.status(500).json({ message: 'Error al subir la imagen a ImgBB', error: error.message });
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
