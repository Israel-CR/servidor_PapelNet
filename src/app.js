require('dotenv').config()
const express = require("express");
const cors = require("cors");


const app = express();

app.use(
  cors()
);

app.use(express.json());

//RUTAS
app.get("/", (req, res) => {
  res.send("Bienvenido a la API RESTFull de PapelNet");
});


const authRoutes = require("./routes/auth.routes");
const productRoutes = require('./routes/product.routes');

//RUTAS PARA LA AUTENTICACION
app.use("", authRoutes);

app.use("", productRoutes);

app.set("port", process.env.PORT || 5000);

module.exports = app;

