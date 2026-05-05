import express from 'express';
import { createServiceRequest, getMyRequests, getAllRequests, updateRequestStatus, } from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(protect, createServiceRequest).get(protect, getMyRequests);
router.route('/all').get(protect, admin, getAllRequests);
router.route('/:id').put(protect, updateRequestStatus);
export default router;
