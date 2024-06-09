require('dotenv').config()
const express = require("express");
const cors = require("cors");


const app = express();

app.use(
  cors()
);

app.use(express.json());

//RUTAS Principal a la API
app.get("/", (req, res) => {
  res.send("Bienvenido a la API RESTFull de PapelNet");
});


const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const servicesRoutes = require('./routes/service.routes');
const salesRoutes = require('./routes/sales.routes');
const expensesRoutes = require('./routes/expenses.routes');



//RUTAS 
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/services", servicesRoutes);
app.use("/sales", salesRoutes);
app.use("/expenses", expensesRoutes);



app.set("port", process.env.PORT || 5000);

module.exports = app;

