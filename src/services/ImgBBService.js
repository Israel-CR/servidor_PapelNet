const fetch = require('node-fetch');
const FormData = require('form-data');

class ImgBBService {
  constructor(apiKey) {
    this.apiKey = apiKey; // Usar la clave API de ImgBB
  }

  async uploadImage(file) {
    const form = new FormData();
    form.append('image', file.buffer, file.originalname);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Retorna la URL de la imagen subida
    } else {
      throw new Error('Error al cargar la imagen en ImgBB');
    }
  }
}

module.exports = ImgBBService;
