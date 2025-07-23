'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const BecomeSponsorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // You can hook this to an email API or backend
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="md:w-2/5 flex items-center justify-center py-8 px-12 text-center">
        <div>
          <h1 className="text-6xl hero-text font-semibold text-white mb-4">Become a Sponsor</h1>
          <p className="text-sm text-white max-w-md mx-auto">
            Partner with Africa’s leading summit. Fill in the enquiry form to receive our sponsorship pack and next steps.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="md:w-3/5 p-8 sm:p-10 md:p-16 text-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f41] transition-all text-white"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="border border-white text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f41] transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border border-white text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f41] transition-all"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border border-white text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f41] transition-all"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="border border-white text-white px-4 py-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#ff7f41] transition-all"
            ></textarea>
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ backgroundColor: "#ff7f41" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative px-6 py-2 border border-gray-500 bg-gray-500 text-black nav-text font-medium uppercase overflow-hidden group"
          >
            <span className="relative z-10">Submit Enquiry</span>
            <span className="absolute inset-0 w-0 bg-[#ff7f41] transition-all duration-300 group-hover:w-full"></span>
          </motion.button>

          
        </form>
      </div>
    </section>
  );
};

export default BecomeSponsorForm;
