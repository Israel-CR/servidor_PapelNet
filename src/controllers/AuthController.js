const authController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { create, getByUsername } = require("../models/Users");
const createAccessToken = require("../libs/jwt");

authController.registrar =  (req, res) => {
  const { nombre,telefono, usuario, contraseña } = req.body;
  

  getByUsername(usuario, (err, user) => {
    if (err)
      return res.status(500).json({ error: "Error interno del servidor" });
    if (user)
      return res
        .status(400)
        .json({ error: "el nombre de usuario ya esta en uso" });

    //si el usuario aun no se ha registrado
    create(nombre,telefono,usuario, contraseña, (err, usuario) => {
      if (err) {
        return res.status(500).json({ error: "Error interno del servidor" });
      }
      return res.status(201).json({ usuario});
    });
  });
};


authController.login = async (req, res) => {
  const {usuario, contraseña } = req.body;
  getByUsername(usuario, (err, usuario) => {
    if (err) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }


    //comparar la contraseña
    bcrypt.compare(contraseña, usuario.contrasena, async (err, success) => {
        if (err || !success) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        //generar el token
        const token = await createAccessToken({ user: usuario.usuario  })
        res.cookie('token', token);
        res.json({
               'token': token
        })
    });
  });
};

module.exports = authController;
