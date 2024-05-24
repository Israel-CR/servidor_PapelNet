const {model, Schema}= require('mongoose')

const productSchema= new Schema({
    nombre:{
        type:String,
        required:true,
    },
    descripcion:{
        type:String,
        required:true
    },
    categoria:{
        type:String,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    fecha_ingreso:{
        type:String,
        required:true,
    },
    provedor:{
        type:String
    }
})

module.exports= model('Products',productSchema)