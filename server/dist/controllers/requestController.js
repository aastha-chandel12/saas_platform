import asyncHandler from 'express-async-handler';
import ServiceRequest from '../models/ServiceRequest.js';
import sendEmail from '../utils/sendEmail.js';
// @desc    Create new service request
// @route   POST /api/requests
// @access  Private
const createServiceRequest = asyncHandler(async (req, res) => {
  const { serviceType, description, deadline, attachments } = req.body;
  const request = await ServiceRequest.create({
    userId: req.user._id,
    serviceType,
    description,
    deadline,
    attachments
  });
  if (request) {
    // Send Email Notification
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
    try {
      await sendEmail({
        to: adminEmails,
        from: req.user.email,
        replyTo: req.user.email,
        subject: `New Request: ${serviceType}`,
        html: htmlContent
      });
    }
    catch (err) {
      console.error('Notification email failed to send');
      // We don't throw error here to avoid failing the whole request creation
    }
    res.status(201).json(request);
  }
  else {
    res.status(400);
    throw new Error('Invalid request data');
  }
});
// @desc    Get user service requests
// @route   GET /api/requests
// @access  Private
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ userId: req.user._id });
  res.json(requests);
});
// @desc    Get all service requests (Admin only)
// @route   GET /api/requests/all
// @access  Private/Admin
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({}).populate('userId', 'name email');
  res.json(requests);
});
// @desc    Update service request (Admin only)
// @route   PUT /api/requests/:id
// @access  Private/Admin
const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id).populate('userId', 'name email');
  if (request) {
    const oldStatus = request.status;
    request.status = req.body.status || request.status;
    request.adminNotes = req.body.adminNotes !== undefined ? req.body.adminNotes : request.adminNotes;
    const updatedRequest = await request.save();
    // Send status update email to user if status changed
    if (oldStatus !== updatedRequest.status) {
      const user = request.userId;
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 24px; border: 1px solid #f1f5f9; border-radius: 16px; max-width: 600px; margin: auto; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 12px; background-color: #f5f3ff; border-radius: 12px; color: #4f46e5;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <h2 style="color: #1e293b; margin-bottom: 8px; text-align: center;">Status Update: ${updatedRequest.status}</h2>
          <p style="color: #64748b; font-size: 16px; text-align: center; margin-bottom: 32px;">Hello ${user.name}, your service request status has been updated.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Request Details</p>
            <p style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b; font-weight: 700;">${request.serviceType}</p>
            <p style="margin: 0; font-size: 14px; color: #64748b;">ID: #${request._id}</p>
          </div>

          ${request.adminNotes ? `
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Admin Message</p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 12px; color: #334155; font-style: italic; line-height: 1.5;">"${request.adminNotes}"</div>
            </div>
          ` : ''}

        
          
          <hr style="margin: 32px 0; border: 0; border-top: 1px solid #f1f5f9;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated notification from Servicely Platform. Please do not reply to this email.</p>
        </div>
      `;
      try {
        await sendEmail({
          to: user.email,
          subject: `Update on your Request: ${updatedRequest.status}`,
          html: htmlContent
        });
      }
      catch (err) {
        console.error('Status update email failed to send');
      }
    }
    res.json(updatedRequest);
  }
  else {
    res.status(404);
    throw new Error('Request not found');
  }
});
export { createServiceRequest, getMyRequests, getAllRequests, updateRequestStatus };
