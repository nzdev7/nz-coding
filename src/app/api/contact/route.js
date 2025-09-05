import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';
import { headers } from 'next/headers';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting - simple in-memory store (use Redis in production)
const rateLimit = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per 15 minutes

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, [now]);
    return false;
  }

  const requests = rateLimit.get(ip).filter((time) => now - time < windowMs);
  requests.push(now);
  rateLimit.set(ip, requests);

  return requests.length > maxRequests;
}

function validateContactData(data) {
  const errors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional)
  if (data.phone && data.phone.trim().length > 20) {
    errors.phone = 'Phone number cannot exceed 20 characters';
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length > 1000) {
    errors.message = 'Message cannot exceed 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function getClientIP(request) {
  // Get IP from various headers (handles proxies, CDNs, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  return 'unknown';
}

export async function POST(request) {
  try {
    // Get client information
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate input data
    const validation = validateContactData({ name, email, phone, message });
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      message: message.trim(),
      ipAddress: clientIP,
      userAgent: userAgent,
    };

    // Try to send email first
    let emailSent = false;
    let emailError = null;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@nz.nawazeditor.com',
        to: process.env.CONTACT_EMAIL || 'nzdev7@gmail.com',
        subject: `Portfolio Contact: ${contactData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Contact Details</h2>
                
                <div style="margin: 15px 0; padding: 15px; background: #f1f5f9; border-radius: 6px;">
                  <strong style="color: #0891b2;">Name:</strong>
                  <div style="margin-top: 5px; color: #374151;">${contactData.name}</div>
                </div>
                
                <div style="margin: 15px 0; padding: 15px; background: #f1f5f9; border-radius: 6px;">
                  <strong style="color: #0891b2;">Email:</strong>
                  <div style="margin-top: 5px; color: #374151;">
                    <a href="mailto:${contactData.email}" style="color: #0891b2; text-decoration: none;">
                      ${contactData.email}
                    </a>
                  </div>
                </div>
                
                ${
                  contactData.phone
                    ? `
                <div style="margin: 15px 0; padding: 15px; background: #f1f5f9; border-radius: 6px;">
                  <strong style="color: #0891b2;">Phone:</strong>
                  <div style="margin-top: 5px; color: #374151;">
                    <a href="tel:${contactData.phone}" style="color: #0891b2; text-decoration: none;">
                      ${contactData.phone}
                    </a>
                  </div>
                </div>
                `
                    : ''
                }
                
                <div style="margin: 15px 0; padding: 15px; background: #f1f5f9; border-radius: 6px;">
                  <strong style="color: #0891b2;">Message:</strong>
                  <div style="margin-top: 5px; color: #374151; line-height: 1.6;">
                    ${contactData.message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                  <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
                  <p><strong>IP Address:</strong> ${clientIP}</p>
                </div>
              </div>
            </div>
          </div>
        `,
        // Plain text version for better deliverability
        text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}

Message:
${contactData.message}

---
Submitted: ${new Date().toLocaleString()}
IP Address: ${clientIP}
        `.trim(),
      });

      emailSent = true;
      console.log('✅ Email sent successfully via Resend');
    } catch (error) {
      emailError = error.message;
      console.error('❌ Email sending failed:', error);
      // Continue execution - we'll still save to database
    }

    // Save to MongoDB (regardless of email success)
    const contact = new Contact({
      ...contactData,
      emailSent,
      emailError,
    });

    await contact.save();
    console.log('✅ Contact saved to MongoDB');

    // Return response based on email status
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Your message has been received. I'll get back to you soon.",
        warning: 'Email delivery encountered an issue, but your message was saved.',
      });
    }
  } catch (error) {
    console.error('❌ Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Sorry, something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
