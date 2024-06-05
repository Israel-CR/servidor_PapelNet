const {model, Schema, default: mongoose}= require('mongoose')

const SaleServiceSchema=new Schema({
    servicio:{type:mongoose.Schema.Types.ObjectId, ref:"Services", required:true},
    descripcion:{type:String},
    cantidad:{type:Number, required:true},
    total:{type:Number, required:true, default:0}
},{
    timestamps:true
})


module.exports= model("SaleServices",SaleServiceSchema)

