/** @format */
const koaCompose = require("koa-compose");

const Router = require("koa-router");
const { health } = require("./controllers/health");
const userController = require("./controllers/user");
const jobController = require("./controllers/job");

const routers = new Router();

//User Routes
routers.get("/", health);
routers.get("/users", userController.getUsers);

routers.post("/signup", userController.register);
routers.post("/email/validate", userController.emailExist);
routers.post("/login", userController.login);
routers.get("/user/:email", userController.findUserDetails);
routers.put("/forgetPassword", userController.forgetPassword);
routers.put("/resetPassword", userController.resetPassword);
routers.put(
  "/emailVerificationInfo",
  userController.updateEmailVerificationInfo
);
routers.post("/sendEmail", userController.SendMail);

//Job routes
routers.post("/jobinfo", jobController.create);
routers.get("/jobinfo", jobController.getJobInfo);

module.exports = routers;

//routers.get('/transaction', statementController.registerTransaction);
