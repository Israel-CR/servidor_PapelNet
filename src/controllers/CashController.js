const Cash = require("../models/Cash");
const Recargas = require("../models/Recargas");

const CashController = {};

CashController.getCashBoxes = async (req, res) => {
    try {
      const cajas = await Cash.find();
      if(!cajas)return res.status(404).json({error: 'no hay cajas registradas'})
      res.json(cajas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

CashController.addCashBox = async (req, res) => {
  const inicioHoy = new Date().setHours(0,0,0,0)
  const finHoy =  new Date().setHours(23,59,59,999)

  try {
    const existBox =await Cash.findOne({
        fecha:{
        $gte:inicioHoy,
        $lte:finHoy
      }
    });

    if(existBox) return res.json({message:'ya hay una caja creada hoy'})

    const caja = new Cash();
    const abrirCaja = await caja.save();
    res.json({ message: "Caja abierto con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

CashController.getAllrecargas = async (req, res) => {
  try {
    const recargas = await Recargas.find();
    res.status(200).json(recargas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener servicio por ID
CashController.getServiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const servicio = await Recargas.findById(id);
    if (!servicio)
      return res.status(404).json({ error: "Servicio no encontrado" });

    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

CashController.updateRecarga = async (req, res) => {
  const id = req.params.id;
  try {
    const { saldo } = req.body;
    const recarga = await Recargas.findByIdAndUpdate(
      id,
      { saldo },
      { new: true }
    );
    if (!recarga) {
      return res
        .status(404)
        .json({ message: "Servicio de recarga no encontrado" });
    }
    res
      .status(200)
      .json({
        message: "Servicio de recargas actualizado exitosamente",
        recarga,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

CashController.deleteService = async (req, res) => {
  const id = req.params.id;
  try {
    const servicio = await Recargas.findByIdAndDelete(id);
    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    res.status(200).json({ message: "Servicio eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = CashController;
