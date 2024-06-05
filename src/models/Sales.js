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
    total: { type: Number, required: true, default: 0 },
    fecha: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["EN_PROCESO", "FINALIZADO"],
      required: true,
      default: "EN_PROCESO",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sales", SaleSchema);
