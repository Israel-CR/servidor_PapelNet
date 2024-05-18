    
    const app= require('./app')
   
    async function main(){
        await app.listen(app.get('port'))
        console.log(`Servidor corriendo en el puerto ${app.get('port')}`)
    }

    main()