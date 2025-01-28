const Products = require("../models/Products");

const productsController = {};

productsController.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();

    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productsController.getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Products.findById(id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


productsController.addProducts = async (req, res) => {
  const imageUrl = req.imageUrl; // Usamos la URL de la imagen subida desde ImgBB
  const {
    nombre,
    descripcion,
    seccion,
    stock_bajo,
    categoria,
    precio,
    cantidad,
    proveedor,
  } = req.body;

  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });

  try {
    const newProduct = new Products({
      imagen: imageUrl, // Aquí guardamos la URL de la imagen subida
      nombre,
      descripcion,
      categoria,
      seccion,
      precio,
      stock_bajo,
      stock: cantidad,
      proveedor,
      fecha_ingreso: fechaActual,
    });

    const productSaved = await newProduct.save();

    if (!productSaved)
      return res.status(500).json({ error: "error interno del servidor" });

    return res.status(201).json({ productSaved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productsController.updateProduct = async (req, res) => {
  const { id } = req.params;

  // Si no existe una imagen subida, usar null
  const imageUrl = req.image?.url || null; // Usamos la URL de la imagen desde el middleware, si está disponible

  const {
    nombre,
    descripcion,
    seccion,
    categoria,
    precio,
    cantidad,
    proveedor,
    stock_bajo,
  } = req.body;

  console.log(req.body); // Para verificar los datos que recibimos

  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });

  try {
    // Actualizar el producto con los nuevos datos, incluyendo la URL de la imagen
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        nombre,
        imagen: imageUrl, // Usar la URL de la imagen en lugar del ID
        descripcion,
        categoria,
        seccion,
        precio,
        stock: cantidad,
        proveedor,
        stock_bajo,
        fecha_ingreso: fechaActual,
      },
      { new: true }
    );

    // Verificar si el producto fue encontrado y actualizado
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con el producto actualizado
    res.status(200).json(updatedProduct);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};

productsController.reorderQuantityProduct = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  console.log(req.body);
  console.log(id);
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        stock: cantidad,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "producto Actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

productsController.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productDeleted = await Products.findByIdAndDelete(id);
    if (!productDeleted) {
      return res.status(404).json({ error: "producto no encontrado" });
    }
    res.status(200).json({ message: "producto eliminado" });
  } catch (error) {}
};

module.exports = productsController;
