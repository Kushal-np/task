import express , {Router} from "express"
import { validateRequest } from "../middlewares/validateRequest"
import { registerSchema } from "../validators/Retard/authSchema";
import { registerUser } from "../controllers/RetardController";
import { AnyZodObject } from "zod/v3";
const router = express.Router();

router.post("/register", validateRequest(registerSchema as unknown as AnyZodObject), registerUser);


export default router ; 