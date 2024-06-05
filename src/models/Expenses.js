const {model, Schema, default: mongoose}= require('mongoose')

const expensesSchema=new Schema({
    motivo:{type:String},
    cantidad:{type:Number, required:true},
},{
    timestamps:true
})


module.exports= model("Expenses",expensesSchema)

