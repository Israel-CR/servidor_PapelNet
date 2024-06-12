const Expenses = require("../models/Expenses");

const expensesController={}


expensesController.getAllExpenses=async(req, res)=>{
    try {
        const gastos = await Expenses.find();
        res.status(201).json(gastos);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

expensesController.getExpenseById=async(req, res)=>{
    const id=req.params.id
    try {
      const gasto = await Expenses.findById(id);
      if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
      
      res.status(200).json(gasto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

expensesController.addExpenses=async(req, res)=>{
    const {cantidad, motivo}= req.body
    try {
        const newExpenses = new Expenses({
         cantidad,motivo
        });
        
        const newExpense= await newExpenses.save();

        res.json({ message: "Nuevo gasto agregado" });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

expensesController.updateExpense = async (req, res) => {
    const id= req.params.id
    try {
      const { cantidad,motivo } = req.body;
      const gasto = await Expenses.findByIdAndUpdate(id, {cantidad, motivo}, { new: true });
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }
      res.status(200).json({ message: 'Gasto actualizado exitosamente'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  expensesController.deleteExpense = async (req, res) => {
    const id= req.params.id
    try {
      const gasto = await Expenses.findByIdAndDelete(id);
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }
      res.status(200).json({ message: 'Gasto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports=expensesController;