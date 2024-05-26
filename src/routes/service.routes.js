const { Router } = require("express");
const {
  addServices,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/ServicesController");

const servicesRoutes = Router();

servicesRoutes.route("/addService").post(addServices);
servicesRoutes.route("/").get(getAllServices);
servicesRoutes.route("/:id").get(getServiceById);
servicesRoutes.route("/updateService/:id").put(updateService);
servicesRoutes.route("/deleteService/:id").delete(deleteService);

module.exports = servicesRoutes;
