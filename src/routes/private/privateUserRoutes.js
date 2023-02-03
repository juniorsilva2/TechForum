const express = require("express");
const router = express.Router();
const authenticated = require("../../middleware/authenticated");
const uploadAvatar = require("../../middleware/uploadImage");
const userController = require("../../controllers/userController");

// router.get("/api/user/:id", checkToken, userController.getUser);
// router.get("/api/users", checkToken, userController.getUsers);
// router.put("/api/user/:id", checkToken, userController.updateUser);
// router.put(
//   "/api/user/avatar/:id",
//   checkToken,
//   uploadAvatar.single('image'),
//   userController.updateAvatar
// );
// router.delete("/api/user/:id", checkToken, userController.deleteUser);
// router.get("/api/auth/logout", checkToken, userController.logout);

module.exports = router;
