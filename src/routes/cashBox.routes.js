const { Router } = require("express");

const authRequired = require("../middlewares/validateToken");
const { addCashBox, getCashBoxes } = require("../controllers/CashController");


const cashBoxRoutes= Router()
cashBoxRoutes.route('/open').post(addCashBox)
cashBoxRoutes.route('/').get(getCashBoxes)










module.exports = cashBoxRoutes