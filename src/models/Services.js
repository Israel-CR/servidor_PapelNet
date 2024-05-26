const { model, Schema } = require("mongoose");

const ServiceSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports= model('Services', ServiceSchema)
