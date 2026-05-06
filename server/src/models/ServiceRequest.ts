import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        'Profile Optimization',
        'ATS Resume',
        'Website Development',
        'Portfolio Creation',
        'Career Guidance',
        'Social Growth Strategy',
        'Other'
      ],
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Requested', 'In Progress', 'Completed'],
      default: 'Requested',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    attachments: [
      {
        name: String,
        url: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
