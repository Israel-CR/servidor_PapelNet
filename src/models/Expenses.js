
const {model, Schema,default: mongoose }= require('mongoose')

const expensesSchema=new Schema({
    vendedor:{ type: mongoose.Types.ObjectId, ref: "Users", required: true},
    motivo:{type:String},
    cantidad:{type:Number, required:true},
    fecha:{type: Date, default: Date.now } 
},{
    timestamps:true
})


module.exports= model("Expenses",expensesSchema)

