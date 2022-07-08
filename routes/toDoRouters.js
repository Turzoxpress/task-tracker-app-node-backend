const controllers = require("../controllers");
const router = require("express").Router();

const utils = require("../utils/utils");

router.post(
  "/add-task",
  utils.authenticateToken,
  controllers.todo.post.addNewTask
);
router.get(
  "/get-all-tasks",
  utils.authenticateToken,
  controllers.todo.post.getAllTasks
);
router.get(
  "/get-all-tasks-status/:status",
  controllers.todo.post.getAllTasksStatus
);
router.post(
  "/change-task",
  utils.authenticateToken,
  controllers.todo.post.changeTaskStatus
);
router.post(
  "/delete-task",
  utils.authenticateToken,
  controllers.todo.post.deleteTask
);
module.exports = router;
