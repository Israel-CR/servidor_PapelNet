const { Router } = require("express");
const { addExpenses, getAllExpenses, getExpenseById, updateExpense, deleteExpense } = require("../controllers/ExpensesController");
const authRequired = require("../middlewares/validateToken");


const expensesRoutes= Router()
expensesRoutes.route('/addExpense').post(authRequired,addExpenses)
expensesRoutes.route('/').get(getAllExpenses)
expensesRoutes.route('/:id').get(getExpenseById)
expensesRoutes.route('/updateExpense/:id').put(updateExpense)
expensesRoutes.route('/deleteExpense/:id').delete(deleteExpense)






module.exports = expensesRoutes