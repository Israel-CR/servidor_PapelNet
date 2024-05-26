const { Router } = require("express");

const productRoutes = Router();

const {
  addProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/ProductsController");

productRoutes.route("/").get(getAllProducts);
productRoutes.route("/:id").get(getProductById);
productRoutes.route("/addProduct").post(addProducts);
productRoutes.route("/updtProduct/:id").put(updateProduct);
productRoutes.route("/deleteProduct/:id").delete(deleteProduct);

module.exports = productRoutes;
