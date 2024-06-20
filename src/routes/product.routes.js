const { Router } = require("express");

const productRoutes = Router();

const {
  addProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/ProductsController");
const handleUpload = require("../middlewares/uploadImage");
const handleUploadUpdate = require("../middlewares/uploadUpdateImage");

productRoutes.route("/").get(getAllProducts);
productRoutes.route("/:id").get(getProductById);
productRoutes.route("/addProduct").post(handleUpload, addProducts);
productRoutes.route("/updtProduct/:id").put(handleUploadUpdate,updateProduct);
productRoutes.route("/deleteProduct/:id").delete(deleteProduct);

module.exports = productRoutes;
