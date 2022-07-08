const controllers = require("../controllers");
const router = require("express").Router();

router.post("/add-task", controllers.todo.post.addNewTask);
router.get("/get-all-tasks", controllers.todo.post.getAllTasks);
router.post("/change-task", controllers.todo.post.changeTaskStatus);
router.post("/delete-task", controllers.todo.post.deleteTask);
module.exports = router;
