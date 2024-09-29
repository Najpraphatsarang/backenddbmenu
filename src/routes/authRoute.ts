import { Router } from "express";
import { login} from "../controllers/userController";

const route = Router();

route.post("/login", login); // เส้นทางสำหรับเข้าสู่ระบบ

export default route;
