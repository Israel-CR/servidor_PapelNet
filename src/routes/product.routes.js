const { Router } = require("express");

const productRoutes=Router()

const {addProducts}= require('../controllers/ProductsController')


productRoutes.route('/addProduct')
.post(addProducts)



module.exports= productRoutes