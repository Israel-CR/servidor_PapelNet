const { Router } = require("express");

const userRoutes = Router();

const {
  register,
  login,
  deleteUser,
  getAllUsers,
  updateUser,
  getUserById,
} = require("../controllers/UsersController");

userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getUserById);
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.put("/updateUser/:id", updateUser);
userRoutes.delete("/deleteUser/:id", deleteUser);
module.exports = userRoutes;
