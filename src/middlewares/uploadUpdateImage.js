const multer = require('multer');
const ImgBBService = require('../services/ImgBBService'); // Importar el servicio ImgBB
const { default: mongoose } = require('mongoose');

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.single('imagen');

// Middleware para manejar la edición de imágenes
const handleUploadEdit = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to upload file', error: err });
    }

    const { oldImageId } = req.body;

    // Si no hay imagen para actualizar
    if (oldImageId === 'null' && !req.file) {
      req.image = { url: null };
      return next();
    }

    try {
      let imageUrl;

      // Si se proporciona un ID de imagen existente
      if (oldImageId !== 'null') {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(oldImageId)) {
          return res.status(400).json({ message: 'Invalid ID' });
        }

        // Si se proporciona un archivo, subimos la nueva imagen a ImgBB
        if (req.file) {
          const imgBBService = new ImgBBService(process.env.IMGBB_API_KEY);
          imageUrl = await imgBBService.uploadImage(req.file);
        } else {
          // Si no se proporciona archivo, mantenemos la URL de la imagen anterior
          // Aquí puedes agregar la lógica para obtener la URL de la imagen anterior
          imageUrl = req.body.oldImageUrl;
        }
      } else {
        // Si no hay un ID previo pero se proporciona una nueva imagen, la subimos a ImgBB
        if (req.file) {
          const imgBBService = new ImgBBService(process.env.IMGBB_API_KEY);
          imageUrl = await imgBBService.uploadImage(req.file);
        } else {
          return res.status(400).json({ message: 'No file uploaded' });
        }
      }

      // Guardar la URL de la imagen en la solicitud para el siguiente middleware
      req.image = { url: imageUrl };

      next(); // Pasar al siguiente manejador
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload image', error });
    }
  });
};

module.exports = handleUploadEdit;
