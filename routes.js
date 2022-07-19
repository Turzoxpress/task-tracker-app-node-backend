const userRoutes = require("./routes/userRoutes");
const toDoRouters = require("./routes/toDoRouters");

module.exports = (app) => {
  app.use("/user", userRoutes);
  app.use("/todo", toDoRouters);

  app.get("/welcome", (req, res) => {
    return res.json({
      code: 200,
      message: "Congratulations! Your Task Tracker backend is ready!",
    });
  });
};
