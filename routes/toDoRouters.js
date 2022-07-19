const controllers = require("../controllers");
const router = require("express").Router();

const utils = require("../utils/utils");

//----------------
const multer = require("multer");

function getSystemTime() {
  return Date.now();
}

function getRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 900000000);
}

// function customTrimString(name) {
//   let finalFileName = "";
//   for (let i = 0; i < name.length; i++) {
//     if (name.charAt(i) != " ") {
//       finalFileName = finalFileName + name.charAt(i);
//     }
//   }

//   return finalFileName;
// }

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  async filename(req, file, cb) {
    const newFilePath =
      getRandomNumber() +
      "_" +
      getRandomNumber() +
      "_" +
      getSystemTime() +
      "_" +
      file.originalname;
    //let newCustomPath = await customTrimString(newFilePath);
    console.log("New Image Path : " + newFilePath);
    cb(null, newFilePath);
  },
});
const uploadWithCustomSettings = multer({ storage });

//-----------

router.post(
  "/add-task",
  utils.authenticateToken,
  uploadWithCustomSettings.single("file"),
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

router.post(
  "/get-file",
  utils.authenticateToken,
  controllers.todo.post.getFile
);

router.get("/task-count", controllers.todo.post.getTotalTaskCount);
module.exports = router;
