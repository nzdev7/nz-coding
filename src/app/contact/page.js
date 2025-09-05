'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return '';

      case 'phone':
        if (value && value.length > 20) return 'Phone number cannot exceed 20 characters';
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length > 1000) return 'Message cannot exceed 1000 characters';
        return '';

      default:
        return '';
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle input blur (mark as touched)
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Success toast
        toast.success(data.message, {
          duration: 5000,
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });

        // Show warning if email had issues
        if (data.warning) {
          toast(data.warning, {
            icon: '⚠️',
            duration: 7000,
            style: {
              background: '#f59e0b',
              color: '#ffffff',
            },
          });
        }

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setErrors({});
        setTouched({});
      } else {
        // Handle validation errors from server
        if (data.errors) {
          setErrors(data.errors);
          toast.error('Please fix the errors below');
        } else {
          toast.error(data.message || 'Something went wrong');
        }
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-primary min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            fontSize: '14px',
            borderRadius: '8px',
          },
        }}
      />

      <div className="container py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl lg:text-5xl font-nunito font-extrabold mb-4 text-secondary">
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary max-w-2xl mx-auto">
              Have a project in mind or just want to say hello? I'd love to hear from you. Send me a message and I'll
              respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:pr-8">
              <h2 className="text-2xl lg:text-3xl font-nunito font-extrabold mb-6 text-secondary">
                Let's Start a <span className="text-gradient">Conversation</span>
              </h2>

              <p className="text-secondary mb-8 text-lg leading-relaxed">
                Whether you're looking to build a new website, improve an existing one, or discuss a potential
                collaboration, I'm here to help bring your ideas to life.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient rounded-lg flex-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-nunito font-bold text-secondary">Email</h3>
                    <p className="text-tertiary">your-email@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient rounded-lg flex-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-nunito font-bold text-secondary">Response Time</h3>
                    <p className="text-tertiary">Usually within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient rounded-lg flex-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-nunito font-bold text-secondary">Location</h3>
                    <p className="text-tertiary">Available worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary p-8 lg:p-10 rounded-2xl shadow-primary">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-secondary mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 rounded-lg bg-primary border-2 transition-300 text-secondary placeholder-gray-400 focus:outline-none ${
                      errors.name && touched.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-primary focus:border-cyan-500 dark:focus:border-cyan-400'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && touched.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-secondary mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 rounded-lg bg-primary border-2 transition-300 text-secondary placeholder-gray-400 focus:outline-none ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-primary focus:border-cyan-500 dark:focus:border-cyan-400'
                    }`}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-secondary mb-2">
                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 rounded-lg bg-primary border-2 transition-300 text-secondary placeholder-gray-400 focus:outline-none ${
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-primary focus:border-cyan-500 dark:focus:border-cyan-400'
                    }`}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-secondary mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 rounded-lg bg-primary border-2 transition-300 text-secondary placeholder-gray-400 focus:outline-none resize-vertical ${
                      errors.message && touched.message
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-primary focus:border-cyan-500 dark:focus:border-cyan-400'
                    }`}
                    placeholder="Tell me about your project or just say hello..."
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message && touched.message ? (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.message}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.message.length}/1000</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-primary py-4 px-6 rounded-lg font-bold text-base transition-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
