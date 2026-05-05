import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Feedback from '../models/Feedback.js';
import Stats from '../models/Stats.js';
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});
// @desc    Get all service requests
// @route   GET /api/requests/all
// @access  Private/Admin
export const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({}).populate('userId', 'name email');
    res.json(requests);
});
// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
export const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status, adminNotes } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (request) {
        request.status = status || request.status;
        request.adminNotes = adminNotes !== undefined ? adminNotes : request.adminNotes;
        await request.save();
        res.json(request);
    }
    else {
        res.status(404);
        throw new Error('Request not found');
    }
});
// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({}).populate('userId', 'name email');
    res.json(feedback);
});
// @desc    Get global stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
    let stats = await Stats.findOne({ key: 'global_stats' });
    if (!stats) {
        stats = await Stats.create({ key: 'global_stats', studentsHelped: 1000 });
    }
    res.json(stats);
});
// @desc    Update global stats
// @route   PUT /api/admin/stats
// @access  Private/Admin
export const updateStats = asyncHandler(async (req, res) => {
    const { studentsHelped, projectsCompleted, successRate } = req.body;
    const stats = await Stats.findOneAndUpdate({ key: 'global_stats' }, { studentsHelped, projectsCompleted, successRate }, { new: true, upsert: true });
    res.json(stats);
});
