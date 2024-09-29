import { Router } from "express";
import { create, login, find,me} from "../controllers/userController";

const route = Router();

// เส้นทางสำหรับการสร้างผู้ใช้ใหม่ (การลงทะเบียน)
// route.post("/", create); // ใช้ /register เพื่อความชัดเจน
// route.get("/",find);
route.get("/me", me);


export default route;
