const express = require("express");
const cors = require("cors");
const db = require("./dbConfig");

const app = express();

app.use(
  cors()
);

app.use(express.json());

//RUTAS
app.get("/", (req, res) => {
  res.send("Bienvenido a la API RESTFull de la libreria");
});

const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");

//RUTAS PARA LA AUTENTICACION
app.use("", authRoutes);

app.use("/api", usersRoutes);
app.get("/peliculas", (req, res) => {
  db.query("SELECT * FROM peliculas", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.set("port", process.env.PORT || 5000);

module.exports = app;

