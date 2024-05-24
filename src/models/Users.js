const { model, Schema } = require('mongoose');

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        unique: true,
        required: true,
    },
    rol: {
        type: String,
        default:"VENDEDOR"
    },
   
    password: {
        type: String,
        required: true
    }
},{
timestamps:true
})
module.exports = model('Users', usuarioSchema);
