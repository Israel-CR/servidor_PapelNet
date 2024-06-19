const { model, Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  
  nombre: {
    type: String,
    required: true,
  },
  imagen:{type: mongoose.Schema.Types.ObjectId, ref:"Images"},
  descripcion: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  seccion: {
    type: String,
    enum: ["papeleria", "regalos"],
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  stock_bajo: {
    type: Number,
    required: true,
  },
  fecha_ingreso: {
    type: String,
    required: true,
  },
  proveedor: {
    type: String,
  },
},{
    timestamps:true
    });

module.exports = model("Products", productSchema);
