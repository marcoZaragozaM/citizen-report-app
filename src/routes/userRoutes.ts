import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  getMe,
  updateMe
} from "../controllers/userController";

const router = Router();

// 👤 obtener usuario logueado
router.get("/me", protect, getMe);

// ✏️ actualizar usuario
router.put("/me", protect, updateMe);

export default router;