import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// 🔐 RECUPERAR PASSWORD
router.post('/forgot-password', forgotPassword);

// 🔐 RESET PASSWORD (NUEVA)
router.post('/reset-password', resetPassword);

export default router;