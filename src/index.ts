import express from "express";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import { verify } from "./middlewares/verify";
import { CustomRequest } from "./middlewares/verify"; // นำเข้า CustomRequest

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;
const prefix = "/backend/api";

app.use(prefix + "/auth", authRoute);
app.use(prefix + "/users",verify,userRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
