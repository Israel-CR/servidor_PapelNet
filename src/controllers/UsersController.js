const Users = require("../models/Users");
const userController = {}

const bcrypt = require("bcryptjs");

const createAccessToken = require("../libs/jwt");

userController.register = async (req, res) => {
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
   
    return res.status(201).json({message:'nuevo usuario creado'});
   
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


userController.login = async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
      const userFound= await Users.findOne({usuario})
      if(!userFound) return res.status(400).json({error: 'usuario no encontrado'});
      const isValidPassword = await bcrypt.compare(contraseña, userFound.password)
      if(!isValidPassword) return res.status(400).json({error:'contraseña incorrecta'})

      const token = await createAccessToken({ id: userFound._id })
      res.cookie('token', token);

      res.json({
              'rol':userFound.rol,
             'token': token
      })
      
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
}




userController.getAllUsers = async (req, res) => {
    try {
     const users = await Users.find({rol:"VENDEDOR"},'usuario rol telefono nombre');

     res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  userController.getUserById = async (req, res) => {
    const id=req.user.id
    try {
      const usuario = await Users.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({id:usuario._id,nombre:usuario.nombre,telefono:usuario.telefono, rol:usuario.rol});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  userController.updateUser = async (req, res) => {
    const id= req.params.id;
    try {
      const { nombre, telefono, usuario, contraseña } = req.body;
      const updatedUser = await Users.findByIdAndUpdate(id, { nombre, telefono, usuario, contraseña}, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario actualizado exitosamente', updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

 userController.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userDeleted = await Users.findByIdAndDelete(id);
      if (!userDeleted) {
        return res.status(404).json({ error: "usuario no encontrado" });
      }
      return res.status(204).json({ userDeleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports= userController