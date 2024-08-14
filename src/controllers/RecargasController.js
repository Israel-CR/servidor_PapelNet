const Recargas = require("../models/Recargas");


const recargasController = {};


recargasController.sellrecargas = async (req, res) => {
  const userId = req.user.id;
  const {detallesServicio,total_venta} = req.body;
  try {
    const newSale = new Recargas({
      vendedor:userId,
      detallesServicio,
      total_venta
    });

    

    const savedSale = await newSale.save();
    res.json({ message: "Venta de servicio registrada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


recargasController.addRecargas = async (req, res) => {
  const { compania, saldo,} = req.body;
  try {
    const newRecarga = new Recargas({
      compania,
      saldo
    });
    const newService= await newRecarga.save();
    res.json({ message: "Servicio de recargas agregado"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


recargasController.getAllrecargas = async (req, res) => {
    try {
      const recargas = await Recargas.find();
      res.status(200).json(recargas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Obtener servicio por ID
recargasController.getServiceById = async (req, res) => {
    const id= req.params.id
    try {
      const servicio = await Recargas.findById(id);
      if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
      
      res.status(200).json(servicio);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  recargasController.updateRecarga = async (req, res) => {
    const id= req.params.id
    try {
      const { saldo} = req.body;
      const recarga = await Recargas.findByIdAndUpdate(id, {saldo}, { new: true });
      if (!recarga) {
        return res.status(404).json({ message: 'Servicio de recarga no encontrado' });
      }
      res.status(200).json({ message: 'Servicio de recargas actualizado exitosamente', recarga });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  recargasController.deleteService = async (req, res) => {
    const id= req.params.id
    try {
      const servicio = await Recargas.findByIdAndDelete(id);
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
      res.status(200).json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = recargasController;
