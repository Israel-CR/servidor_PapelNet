const { model, Schema} = require('mongoose')

const CashSchema =  new Schema({
    dineroEnCaja:{
        type: Number,
        min:0,
        default: 0
    },
    ventasProductos:{
        type: Number,
        required:true,
        min:0,
        default:0
    },
    ventasServicios:{
        type: Number,
        required:true,
        min:0,
        default:0
    },
    gastos:{
        type: Number,
        required:true,
        min:0,
        default:0
    },
    SaldoTelcel:{
        type: Number,
        required:true,
        min:0,
        default:0
    },
    fecha: {
        type:Date,
        default: Date.now
    },
    estado:{
        type:String,
        enum:['abierto', 'cerrado'],
        default: 'abierto',
        required:true
    }


},{
    timestamps: true
})


module.exports = model('Cash',CashSchema);