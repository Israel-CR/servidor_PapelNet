const {Router} =  require('express');

const authRoutes= Router()

const {registrar,login}= require('../controllers/AuthController')

authRoutes.post('/register', registrar);
authRoutes.post('/login', login);




module.exports= authRoutes;