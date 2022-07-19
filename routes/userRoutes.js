const controllers = require("../controllers");
const router = require("express").Router();

const utils = require("../utils/utils");

router.post("/register-user", controllers.user.post.registerNewUser);
router.post("/login-user", controllers.user.post.loginUser);
router.get(
  "/get-users",
  utils.authenticateToken,
  controllers.user.post.getAllUsers
);
router.post(
  "/update-user-role",
  utils.authenticateToken,
  controllers.user.post.updateUserRole
);

router.post(
  "/delete-user",
  utils.authenticateToken,
  controllers.user.post.deleteUser
);
module.exports = router;
