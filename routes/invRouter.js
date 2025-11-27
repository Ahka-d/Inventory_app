const { Router } = require("express");
const invController = require("../controllers/invController.js")
const invRouter = Router()
const { validateUser } = require("../src/validator.js");

invRouter.get("/", invController.home);
invRouter.get("/sign-up", invController.getSignUp);
invRouter.post("/sign-up", validateUser, invController.postSignUp);
invRouter.get("/log-in", invController.getLogIn);
invRouter.post("/log-in", invController.postLogIn);
invRouter.get("/log-out", invController.getLogOut);
invRouter.get("/read-product/:id", invController.getShowunique);
invRouter.get("/create-product", invController.getCreateProduct);
invRouter.post("/create-product", invController.postCreateProduct);
invRouter.get("/update-product/:id", invController.getUpdateProduct);
invRouter.post("/update-product/:id", invController.postUpdateProduct);
invRouter.get("/delete-product/:id", invController.getDeleteProduct);

module.exports = invRouter