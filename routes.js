/** @format */
const koaCompose = require("koa-compose");

const Router = require("koa-router");
const { health } = require("./controllers/health");
const userController = require("./controllers/user");

const routers = new Router();

routers.get("/", health);

routers.post("/signup", userController.register);

routers.post("/login", userController.login);

module.exports = routers;

//routers.get('/transaction', statementController.registerTransaction);
