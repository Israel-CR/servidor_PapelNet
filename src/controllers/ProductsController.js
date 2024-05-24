const Products = require("../models/Products");

const productsController = {};

productsController.getProducts = async (req, res) => {
  const products = await Products.find();
};

productsController.addProducts = async (req, res) => {
  const { nombre, descripcion, categoria, precio, cantidad, proveedor } =
    req.body;
  const fechaActual = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  try {
    const newProduct = new Products({
      nombre,
      descripcion,
      categoria,
      precio,
      stock: cantidad,
      proveedor,
      fecha_ingreso: fechaActual,
    });

    const productSaved =await newProduct.save();

    if (!productSaved)
      return res.status(500).json({ error: "error interno del servidor" });

    return res.status(201).json({ productSaved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = productsController;
