const mongoose = require('mongoose');

//cadena de conexion
const URI = process.env.MONGODB_URI
            ? process.env.MONGODB_URI
            : 'mongodb://127.0.0.1/PapelNet';


mongoose.connect(URI);


const conexion = mongoose.connection;

conexion.once('open',()=>{
    console.log('conexion exitosa', URI)
});
