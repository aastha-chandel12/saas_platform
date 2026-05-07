import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req: any, res: Response) => {
  const { rating, message } = req.body;

  if (!rating || !message) {
    res.status(400);
    throw new Error('Please provide rating and message');
  }

  const feedback = await Feedback.create({
    userId: req.user._id,
    rating,
    message,
  });

  if (feedback) {
    // Send Email Notification
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981;">New Customer Feedback Received</h2>
        <p><strong>User:</strong> ${req.user.name} (${req.user.email})</p>
        <p><strong>Rating:</strong> ${rating} / 5 Stars</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">${message}</div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #6b7280;">This is an automated notification from Servicely Platform.</p>
      </div>
    `;

    // Fire and forget (Background)
    sendEmail({
      to: adminEmails,
      subject: `New Feedback: ${rating} Star Rating from ${req.user.name}`,
      html: htmlContent
    }).catch(err => console.error('Background Feedback Notification failed:', err.message));

    res.status(201).json(feedback);
  } else {
    res.status(400);
    throw new Error('Invalid feedback data');
  }
});

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.find({}).populate('userId', 'name email');
  res.json(feedback);
});

export { submitFeedback, getAllFeedback };
