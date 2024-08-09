const { default: mongoose, Schema, model } = require("mongoose");

const detallesServicioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    enum: ["Copias", "Investigaciones", "Impresiones", "Recargas", "CURP", "Captura de texto"],
  },
  numero: {
    type: String,
    required: function () {
      return this.nombre === "Recargas";
    },
    minlength: 10,
  },
  cantidadRecarga: {
    type: Number,
    required: function () {
      return this.nombre === "Recargas";
    },
    enum: [10, 20, 30, 50, 80, 100, 150, 200, 300, 500],
  },
  tipo: {
    type: String,
    enum:["Color","Blanco y Negro"],
    required: function () {
      return ["Investigaciones", "Copias", "Impresiones","CURP"].includes(this.nombre);
    },
  },
  precio_unitario: {
    type: Number,
    required: function () {
      return ["Investigaciones", "Copias", "Impresiones","CURP",'Captura de texto'].includes(this.nombre);
    },
  },
  precio_investigacion: {
    type: Number,
    required: function () {
      return ["Investigaciones"].includes(this.nombre);
    },
  },
  cantidad: {
    type: Number,
    required: function () {
      return ["Investigaciones", "Copias", "Impresiones", "CURP"].includes(this.nombre);
    },
  },
  total: {
    type: Number,
    required: true,
  },
}, { _id: false });

const servicioSchema = new Schema({
  vendedor: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
  detallesServicio: [detallesServicioSchema],
  total_venta: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

const Servicio = model("Services", servicioSchema);

module.exports = Servicio;