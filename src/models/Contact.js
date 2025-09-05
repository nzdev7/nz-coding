import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      maxLength: [20, 'Phone number cannot exceed 20 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxLength: [1000, 'Message cannot exceed 1000 characters'],
    },
    // Metadata for tracking
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    // Email delivery status
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailError: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ContactSchema.index({ submittedAt: -1 });
ContactSchema.index({ emailSent: 1 });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
