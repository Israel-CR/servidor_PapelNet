    
    const app= require('./app')
   
    // importar la configuracion de la base de datos
require('./dbConfig')
    
    
    async function main(){
        await app.listen(app.get('port'))
        console.log(`Servidor corriendo en el puerto ${app.get('port')}`)
    }

    main()