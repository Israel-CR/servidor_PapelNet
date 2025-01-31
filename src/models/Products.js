const { model, Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  
  nombre: {
    type: String,
    required: true,
  },
  imagen:String,
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
    enum: ["papeleria", "regalos","tienda"],
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
  fecha_caducidad: {
    type: String,
    required: function () {
      return ["tienda"].includes(this.seccion);
    },
  },
  
},{
    timestamps:true
    });

module.exports = model("Products", productSchema);
