const { model, Schema, default: mongoose } = require("mongoose");

const SaleSchema = new Schema(
  {
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        cantidad: { type: Number, required: true },
        precio_unitario: { type: Number, required: true },
        precio_total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    descuento: { type: Number, required: true, default: 0, min: 0, max: 100 },
    total: { type: Number, required: true, default: 0 },

    fecha: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sales", SaleSchema);
