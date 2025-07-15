import express from "express";
import cors from "cors";

//added code here
import todoRouter from "./routes/todo.js";
//added this code here in backend step
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// 🔒 Protected todo routes
app.use("/todos", verifyToken, todoRouter);



//added code here


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});