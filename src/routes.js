const express = require("express");
const UserController = require("./controller/UserController");

// includes routes
const routes = express.Router();

routes.post("/api/login", UserController.login);

routes.get("/api/user", UserController.index);
routes.get("/api/user/:user_id", UserController.show);
routes.post("/api/user", UserController.store);
routes.put("/api/user/:user_id", UserController.update);

routes.get("api/", (req, res) => res.json({ message: "Hello World" }));

module.exports = routes;
