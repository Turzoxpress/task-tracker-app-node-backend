const controllers = require("../controllers");
const router = require("express").Router();

router.post("/register-user", controllers.user.post.registerNewUser);
router.post("/login-user", controllers.user.post.loginUser);
module.exports = router;
