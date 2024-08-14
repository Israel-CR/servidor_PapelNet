const {model, Schema }= require('mongoose')

const RecargasSchema=new Schema({
    compania: {type: String, required:true},
    saldo:{
        required:true,
        type:Number,
        min:0,
    },
    historialRecargas:[
        {
            numero:Number,
            monto:{
                type:Number,
                enum: [10, 20, 30, 50, 80, 100, 150, 200, 300, 500],
                required: true
            },
            fecha:{ type:Date, default: Date.now}
        },{_id: false}
    ]
    
},{
    timestamps:true
})


module.exports= model("Recargas",RecargasSchema);

