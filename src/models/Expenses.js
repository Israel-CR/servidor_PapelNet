const {model, Schema}= require('mongoose')

const expensesSchema=new Schema({
    motivo:{type:String},
    cantidad:{type:Number, required:true},
},{
    timestamps:true
})


module.exports= model("Expenses",expensesSchema)

