import express from 'express';
import {
  getAllUsers,
  getAllRequests,
  updateRequestStatus,
  getAllFeedback,
  getStats,
  updateStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/requests', getAllRequests);
router.put('/requests/:id/status', updateRequestStatus);
router.get('/feedback', getAllFeedback);
router.get('/stats', getStats);
router.put('/stats', updateStats);

export default router;
