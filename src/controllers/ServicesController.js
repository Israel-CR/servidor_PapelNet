const Recargas = require("../models/Recargas");
const Services = require("../models/Services");

const servicesController = {};

servicesController.sellServices = async (req, res) => {
  const userId = req.user.id;
  const { detallesServicio, total_venta } = req.body;

  try {
    const newSale = new Services({
      vendedor: userId,
      detallesServicio,
      total_venta,
    });

    for (const servicio of detallesServicio) {
      if (servicio?.nombre === "Recargas") {
        const telcel = await Recargas.findOne({ compania: "Telcel" });
        console.log(telcel);
        if (!telcel)
          return res
            .status(404)
            .json({ error: "servicio de recargas no encontrado" });

        const nuevoSaldo = telcel.saldo - servicio?.cantidadRecarga;
        if (nuevoSaldo <= 0)
          return res.status(400).json({ message: "Saldo Insuficiente" });

        telcel.saldo = nuevoSaldo;
        if (!telcel.historialRecargas) {
          telcel.historialRecargas = [];
        }
        telcel.historialRecargas.push({
          numero: servicio.numero,
          monto: servicio.cantidadRecarga,
        });
        await telcel.save({ new: true });
      }
    }

    const savedSale = await newSale.save();
    res.json({ message: "Venta de servicio registrada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

servicesController.addServices = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  try {
    const newServices = new Services({
      nombre,
      descripcion,
      precio,
    });
    const newService = await newServices.save();
    res.json({ message: "Servicio agregado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

servicesController.getAllServices = async (req, res) => {
  try {
    const servicios = await Services.find().populate("vendedor", "nombre");
    res.status(200).json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener servicio por ID
servicesController.getServiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const servicio = await Services.findById(id);
    if (!servicio)
      return res.status(404).json({ error: "Servicio no encontrado" });

    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

servicesController.getServicesPerMonth = async (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  try {
    const servicios = await Services.find({
      fecha: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    });

    if (!servicios.length)
      return res
        .status(204)
        .json({ message: "No hay servicios registrados en este mes" });

    const serviciosMesPorDia = servicios.reduce((acc, servicio) => {
      const date = servicio.fecha.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const fecha = date.split("/").join("-");
      
      const index = acc.findIndex((item) => item.fecha === fecha);
      if (index === -1) {
        const detalles = servicio.detallesServicio.map((detalle) => ({
          nombre: detalle.nombre,
          cantidad: detalle.cantidad || 1,
        }));

        acc.push({
          fecha,
          total: servicio.total_venta,
          detallesServicio: detalles,
        });
      } else {
        servicio.detallesServicio.forEach((servicio) => {
          const serviceExist = acc[index].detallesServicio.find(
            (s) => s.nombre === servicio.nombre
          );
          if (serviceExist) {
            serviceExist.cantidad += servicio.cantidad || 1;
          } else {
            acc[index].detallesServicio.push({
              nombre: servicio.nombre,
              cantidad: servicio.cantidad || 1,
            });
          }
        });

        acc[index].total += servicio.total_venta;
      }
      return acc;
    }, []);

    res.status(200).json(serviciosMesPorDia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

servicesController.updateService = async (req, res) => {
  const id = req.params.id;
  try {
    const { nombre, descripcion, precio } = req.body;
    const servicio = await Services.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio },
      { new: true }
    );
    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Servicio actualizado exitosamente", servicio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

servicesController.deleteService = async (req, res) => {
  const id = req.params.id;
  try {
    const servicio = await Services.findByIdAndDelete(id);
    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.status(200).json({ message: "Servicio eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = servicesController;
