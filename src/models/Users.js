const db = require("../dbConfig");
const bcrypt = require("bcryptjs");
class Users {
  constructor(id, usuario, contraseña) {
    this.id = id;
    this.usuario = usuario;
    this.contraseña = contraseña;
  }
  static create(nombre,telefono,usuario, contrasena, callback) {
    bcrypt.hash(contrasena, 10, (err, hash) => {
      if (err) return callback(err, null);

      db.query(
        "INSERT INTO usuarios (nombre, telefono,usuario, contrasena) VALUES (?,?,?,?)",
        [nombre,telefono,usuario, hash],
        (err, result) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, result.insertId);
        }
      );
    });
  }

  // static getAll(callback) {
  //   db.query("SELECT  * FROM usuarios", (err, result) => {
  //     if (err) return callback(err, null);

  //     const usuarios = result.map(
  //       (row) => new Users(row.id, row.usuario, row.contrasena)
  //     );
  //     callback(null, usuarios);
  //   });
  // }

  static getByUsername(username,callback) {
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [username], (err, results) => {
      if (err) {
          return callback(err, null);
      }
      if (results.length === 0) {
          return callback(null, null); // Usuario no encontrado
      }
      callback(null, results[0]);
  });
  }
}

module.exports = Users;
