import Express from "express";
// import usersRoutes from "./routes/users.routes";

const app = Express();
const PORT = process.env.PORT || 3000;

// app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
