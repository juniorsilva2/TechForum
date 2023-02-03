const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const uploadAvatar = require("../../middleware/uploadImage");
const userController = require("../../controllers/userController");

router.get("/perfil", authenticated, userController.getUser);
router.get("/perfil/edit", authenticated, userController.updatePage);
router.post("/perfil/edit", authenticated, userController.updateUser);
router.get("/perfil/avatar", authenticated, userController.updateAvatarPage);
router.post("/perfil/avatar", authenticated, uploadAvatar.single('image'), userController.updateAvatar);
router.get("/perfil/delete", authenticated, userController.deletePage);
router.post("/perfil/delete", authenticated, userController.deleteUser);
router.get("/logout", authenticated, userController.logout);

module.exports = router;
