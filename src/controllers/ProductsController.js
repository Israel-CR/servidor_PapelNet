const Products = require("../models/Products");

const productsController = {};

productsController.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate('imagen')

    const productsWithBase64Images = products.map(product => {
      if (product.imagen) {
        const imageBase64 = product.imagen.data.toString('base64');
        return {
          ...product.toObject(),
          imagen: {
            ...product.imagen.toObject(),
            data: imageBase64,
          },
        };
      }
      return product;
    });

    res.status(201).json(productsWithBase64Images);
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


productsController.getProductById = async (req, res) => {
  const id=req.params.id
  try {
    const producto = await Products.findById(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


productsController.addProducts = async (req, res) => {
  const idImage = req.image.id
  const { nombre, descripcion,seccion,stock_bajo, categoria, precio, cantidad, proveedor } =
    req.body;
  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  try {
    const newProduct = new Products({
      imagen:idImage,
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
productsController.updateProduct = async (req,res) =>{
  const { id } = req.params;  
 

  // si no existe el  id de la imagen desde el parametro , poner null
  const idImage = req.image?.id;

  const { nombre, descripcion,seccion, categoria, precio, cantidad, proveedor, stock_bajo} =req.body;

  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  try {
     const updatedProduct = await Products.findByIdAndUpdate(id, {  
      nombre,
      imagen:idImage,
    descripcion,
    categoria,
    seccion,
    precio,
    stock: cantidad,
    proveedor,
    stock_bajo,
    fecha_ingreso: fechaActual }, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }

 

}

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
