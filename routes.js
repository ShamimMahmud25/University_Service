/** @format */
const koaCompose = require("koa-compose");

const Router = require("koa-router");
const { health } = require("./controllers/health");
const userController = require("./controllers/user");

const routers = new Router();

routers.get("/", health);

routers.post("/signup", userController.register);
routers.post("/email/validate",userController.emailExist);
routers.post("/login", userController.login);
routers.post("/user", userController.findUserDetails);
routers.post("/forgetPassword", userController.forgetPassword);
routers.post("/resetPassword", userController.resetPassword);
routers.post("/emailVerificationInfo", userController.updateEmailVerificationInfo);
 routers.post("/sendEmail",userController.SendMail);

module.exports = routers;

//routers.get('/transaction', statementController.registerTransaction);
