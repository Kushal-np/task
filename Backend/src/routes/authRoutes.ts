import express , {Router} from "express"
import { validateRequest } from "../middlewares/validateRequest"
import { registerSchema } from "../validators/Retard/authSchema";
import { registerUser } from "../controllers/RetardController";
const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);


export default router ; 