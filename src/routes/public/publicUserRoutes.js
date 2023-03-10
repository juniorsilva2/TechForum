const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router.get("/register", userController.signInPage);
router.post("/register", userController.register);
router.get("/login", userController.loginPage);
router.post("/login", userController.login);
router.get("/perfil/public/:userName", userController.publicPerfilPage);

module.exports = router;
