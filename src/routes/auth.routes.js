const {Router} =  require('express');

const authRoutes= Router()

const {register,login}= require('../controllers/AuthController')

authRoutes.post('/register', register);
authRoutes.post('/login', login);


module.exports= authRoutes;