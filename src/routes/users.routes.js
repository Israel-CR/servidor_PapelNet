
const {Router} =  require('express');

const userRoutes= Router()

const {getAllusers}= require('../controllers/UsersController')

userRoutes.route('/usuarios')
.get(getAllusers)


module.exports= userRoutes