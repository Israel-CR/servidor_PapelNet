const authController = {};
const bcrypt = require("bcryptjs");

const createAccessToken = require("../libs/jwt");

const Users = require("../models/Users");

authController.register = async (req, res) => {
  const { nombre, telefono, usuario, contraseña } = req.body;

  const userFound = await Users.findOne({ usuario: usuario });
  if (userFound)
    return res
      .status(400)
      .json({ error: "el usuario ya esta en uso, elige otro" });
  try {
    const passwordHash = await bcrypt.hash(contraseña, 10);
    const newUser = new Users({
      nombre: nombre,
      telefono: telefono,
      usuario: usuario,
      password: passwordHash,
    });

    const userSaved = await newUser.save();
   
    return res.status(201).json({ userSaved });
   
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


authController.login = async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
      const userFound= await Users.findOne({usuario})
      if(!userFound) return res.status(400).json({error: 'usuario no encontrado'});

      const isValidPassword = await bcrypt.compare(contraseña, userFound.password)
      if(!isValidPassword) return res.status(400).json({error:'contraseña incorrecta'})

      const token = await createAccessToken({ id: userFound._id })
      res.cookie('token', token);
      
      res.json({
             'token': token
      })
      
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
}

module.exports = authController;
