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
  const id=req.params.id
  try {
    const producto = await Products.findById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


productsController.addProducts = async (req, res) => {
  const { nombre, descripcion,seccion, categoria, precio, cantidad, proveedor } =
    req.body;
  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  try {
    const newProduct = new Products({
      nombre,
      descripcion,
      categoria,
      seccion,
      precio,
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
  const { nombre, descripcion,seccion, categoria, precio, cantidad, proveedor } =req.body

  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  try {
     const updatedProduct = await Products.findByIdAndUpdate(id, {  nombre,
    descripcion,
    categoria,
    seccion,
    precio,
    stock: cantidad,
    proveedor,
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
    return res.status(200).json({ productDeleted });
  } catch (error) {}
};

module.exports = productsController;
