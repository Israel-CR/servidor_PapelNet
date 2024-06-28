const { Router } = require("express");

const productRoutes = Router();

const {
  addProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  reorderQuantityProduct,
} = require("../controllers/ProductsController");
const handleUpload = require("../middlewares/uploadImage");
const handleUploadUpdate = require("../middlewares/uploadUpdateImage");

productRoutes.route("/").get(getAllProducts);
productRoutes.route("/:id").get(getProductById);
productRoutes.route("/addProduct").post(handleUpload, addProducts);
productRoutes.route("/updtProduct/:id").put(handleUploadUpdate,updateProduct);
productRoutes.route("/reorderProduct/:id").put(reorderQuantityProduct);
productRoutes.route("/deleteProduct/:id").delete(deleteProduct);

module.exports = productRoutes;
