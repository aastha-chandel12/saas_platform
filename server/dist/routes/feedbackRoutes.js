import express from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/')
    .post(protect, submitFeedback)
    .get(protect, admin, getAllFeedback);
export default router;
