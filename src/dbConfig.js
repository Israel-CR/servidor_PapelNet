const mysql= require('mysql')

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'Papeleria'
}
)

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
  });
  

  
  module.exports = connection