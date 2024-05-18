
const usersController = {};
const {getAll}=require("../models/Users")


usersController.getAllusers = async (req, res) => {
    getAll((err, usuarios)=>{
        if(err) return res.status(500).json({ error: 'Error al obtener los usuarios'});

        res.json(usuarios)
    })
};


module.exports= usersController