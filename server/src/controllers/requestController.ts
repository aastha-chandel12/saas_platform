import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ServiceRequest from '../models/ServiceRequest.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new service request
// @route   POST /api/requests
// @access  Private
const createServiceRequest = asyncHandler(async (req: any, res: Response) => {
  const { serviceType, description, deadline, attachments } = req.body;

  const request = await ServiceRequest.create({
    userId: req.user._id,
    serviceType,
    description,
    deadline,
    attachments
  });

    if (request) {
    // Send Email Notification in the background
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">New Service Request Submitted</h2>
        <p><strong>User:</strong> ${req.user.name} (${req.user.email})</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
        <p><strong>Description:</strong></p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">${description}</div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #6b7280;">This is an automated notification from Servicely Platform.</p>
      </div>
    `;

    // Fire and forget (Background)
    sendEmail({
      to: adminEmails,
      from: req.user.email,
      replyTo: req.user.email,
      subject: `New Request: ${serviceType}`,
      html: htmlContent
    }).catch(err => console.error('Background Admin Notification failed:', err.message));

    res.status(201).json(request);
  } else {
    res.status(400);
    throw new Error('Invalid request data');
  }
});

// @desc    Get user service requests
// @route   GET /api/requests
// @access  Private
const getMyRequests = asyncHandler(async (req: any, res: Response) => {
  const requests = await ServiceRequest.find({ userId: req.user._id });
  res.json(requests);
});

// @desc    Get all service requests (Admin only)
// @route   GET /api/requests/all
// @access  Private/Admin
const getAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const requests = await ServiceRequest.find({}).populate('userId', 'name email');
  res.json(requests);
});

// @desc    Update service request (Admin only)
// @route   PUT /api/requests/:id
// @access  Private/Admin
const updateRequestStatus = asyncHandler(async (req: any, res: Response) => {
  const { status, adminNotes } = req.body;

  // Validate status
  const allowedStatuses = ['Requested', 'In Progress', 'Completed'];
  if (status && !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be Requested, In Progress, or Completed.');
  }

  const request = await ServiceRequest.findById(req.params.id).populate('userId', 'name email');

  if (request) {
    const oldStatus = request.status;

    // Enforce strict one-way transitions
    if (status && status !== oldStatus) {
      if (oldStatus === 'Completed') {
        res.status(400);
        throw new Error('Completed requests are final and cannot be changed.');
      }
      if (oldStatus === 'Requested' && status !== 'In Progress') {
        res.status(400);
        throw new Error('Requested status can only move to In Progress.');
      }
      if (oldStatus === 'In Progress' && status !== 'Completed') {
        res.status(400);
        throw new Error('In Progress status can only move to Completed.');
      }
    }

    request.status = status || request.status;
    request.adminNotes = req.body.adminNotes !== undefined ? req.body.adminNotes : request.adminNotes;

    const updatedRequest = await request.save();

    // Send status update email to user if status changed
    if (oldStatus !== updatedRequest.status) {
      const user: any = request.userId;
      
      const getStatusColor = (s: string) => {
        if (s === 'Completed') return '#10b981'; // Emerald
        if (s === 'In Progress') return '#f59e0b'; // Amber
        return '#64748b'; // Slate
      };

      const htmlContent = `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 40px 20px; background-color: #f8fafc; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f1f5f9;">
            <!-- Header -->
            <div style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-block; padding: 12px; background-color: #f5f3ff; border-radius: 16px; margin-bottom: 20px;">
                <img src="https://img.icons8.com/fluency/48/service.png" width="32" height="32" alt="Icon" />
              </div>
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Ticket Status Updated</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <p style="color: #64748b; font-size: 16px; margin: 0 0 12px 0;">Hello ${user.name}, your request status is now:</p>
                <span style="display: inline-block; padding: 8px 20px; background-color: ${getStatusColor(updatedRequest.status)}15; color: ${getStatusColor(updatedRequest.status)}; border: 1.5px solid ${getStatusColor(updatedRequest.status)}30; border-radius: 100px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${updatedRequest.status}
                </span>
              </div>

              <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                <h3 style="color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0;">Request Information</h3>
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                   <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0;">${request.serviceType}</p>
                </div>
                <p style="color: #64748b; font-size: 13px; margin: 0;">ID: #${request._id.toString().slice(-6).toUpperCase()}</p>
              </div>

              ${request.adminNotes ? `
                <div style="margin-bottom: 32px;">
                  <h3 style="color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">Message from Agent</h3>
                  <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; border-radius: 8px 16px 16px 8px; padding: 16px 20px; color: #334155; font-size: 15px; line-height: 1.6; font-style: italic;">
                    "${request.adminNotes}"
                  </div>
                </div>
              ` : ''}

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/request/${request._id}" style="display: inline-block; width: 100%; box-sizing: border-box; padding: 16px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; transition: all 0.2s; text-align: center; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                  View Full Progress
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
                This is an automated message from your Service Portal. <br/>
                Please do not reply directly to this email.
              </p>
            </div>
          </div>
        </div>
      `;

      // Fire and forget (Background)
      sendEmail({
        to: user.email,
        subject: `[Status Update] ${updatedRequest.status}: ${request.serviceType}`,
        html: htmlContent
      }).catch(err => console.error('Background User Notification failed:', err.message));
    }

    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
});

export { createServiceRequest, getMyRequests, getAllRequests, updateRequestStatus };
