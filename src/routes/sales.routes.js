const { Router } = require("express");
const { addSales, addProductsForSale, deleteProductsForSale, updateProductsForSale, completeSale, deleteSale, getSalesCompleted, getSalesById } = require("../controllers/SalesController");
const authRequired = require("../middlewares/validateToken");

const salesRoutes=Router()

salesRoutes.post('/addSale',authRequired, addSales)
salesRoutes.get('/',getSalesCompleted)
salesRoutes.get('/:id',getSalesById)
salesRoutes.put('/completeSale/:id', completeSale)
salesRoutes.delete('/deleteSale/:id', deleteSale)

salesRoutes.post('/addProduct/:id', addProductsForSale)
salesRoutes.put('/updateProduct/:id', updateProductsForSale)
salesRoutes.delete('/deleteProduct/:idventa/:idproducto', deleteProductsForSale)

module.exports=salesRoutes