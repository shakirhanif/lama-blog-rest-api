import bodyParser from "body-parser";
import express from "express";
import route from "./routes/router.js";
import cors from "cors";
import connection from "./database/db.js";
const app = express();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
connection();
app.use("/", route);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
