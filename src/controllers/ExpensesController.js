const Expenses = require("../models/Expenses");

const expensesController={}


expensesController.getAllExpenses=async(req, res)=>{
    try {
        const gastos = await Expenses.find().populate("vendedor");
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

expensesController.getExpensesPerMonth=async(req, res)=>{
    const year = req.params.year;
    const month = req.params.month;
    try {
      const gastos = await Expenses.find({
        fecha: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${month}-31`),
        },
      });

      if (!gastos.length) return res.status(204).json({ message: 'No hay gastos registrados' });

      const expensesByDay = gastos.reduce((acc, gasto) => {
        const date = gasto.fecha.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  
        const fecha = date.split("/").join("-");

        const index = acc.findIndex((item) => item.fecha === fecha);
        if (index === -1) {
          acc.push({
            fecha,
            total: gasto.cantidad,
            gastos: [gasto],
          });
        } else {
          acc[index].total += gasto.cantidad;
          acc[index].gastos.push(gasto);
        }
        return acc;

      },[]
       );


      res.status(200).json(expensesByDay);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

expensesController.addExpenses=async(req, res)=>{
  const userId = req.user.id;
    const {cantidad, motivo}= req.body
    try {
        const newExpenses = new Expenses({
          vendedor:userId,
         cantidad,  
         motivo
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