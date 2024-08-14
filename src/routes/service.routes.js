const { Router } = require("express");
const {
  addServices,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  sellServices,
} = require("../controllers/ServicesController");
const authRequired = require("../middlewares/validateToken");
const { addRecargas, getAllrecargas, updateRecarga } = require("../controllers/RecargasController");


const servicesRoutes = Router();
servicesRoutes.route("/sellService").post(authRequired, sellServices);
servicesRoutes.route("/addService").post(addServices);
servicesRoutes.route("/addRecargas").post(addRecargas);
servicesRoutes.route("/recargas").get(getAllrecargas);
servicesRoutes.route("/recargas/addBalance/:id").put(updateRecarga);
servicesRoutes.route("/").get(getAllServices);
servicesRoutes.route("/:id").get(getServiceById);
servicesRoutes.route("/updateService/:id").put(updateService);
servicesRoutes.route("/deleteService/:id").delete(deleteService);

module.exports = servicesRoutes;