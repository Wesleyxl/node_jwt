const express = require("express");
const routes = require("./routes");

// init database;
require("./database");

const app = express();

app.use(express.json());

app.use(routes);

app.listen(8000);
