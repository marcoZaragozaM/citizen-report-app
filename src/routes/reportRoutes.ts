import { Router } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  voteReport,
  deleteReport
} from '../controllers/reportController';

import { protect, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload'; // 🔥 NUEVO

const router = Router();

// Rutas
router.route('/')
  .get(getReports)
  .post(protect, upload.single("image"), createReport); // 🔥 AQUÍ

router.route('/:id')
  .get(getReportById)
  .delete(protect, authorize('administrador'), deleteReport);

router.put('/:id/status',
  protect,
  authorize('moderador', 'administrador', 'autoridad'),
  updateReportStatus
);

router.post('/:id/vote', protect, voteReport);

export default router;