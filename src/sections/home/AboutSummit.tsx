'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const SummitAbout = () => {
  return (
    <section id="summit-about" className="relative w-full flex flex-col md:flex-row items-center min-h-screen py-6 px-6 md:px-16">
      {/* Left Div - Image */}
      <div className="w-full md:w-[60%] h-auto md:h-full flex justify-center">
        <Image 
          src="/assets/images/About.png" 
          alt="Summit About" 
          width={450} height={250} // Reduced for mobile, larger screens will use flex container
          className="object-contain md:w-[550px]" 
        />
      </div>
      
      {/* Right Div - Text with Vertical Line */}
      <div className="w-full md:w-[40%] flex flex-col justify-center relative mt-6 md:mt-0">
        <div className="absolute hidden md:block top-0 bottom-0 left-0 w-[1px] bg-[#ff7f41]" />
        <div className="pl-0 md:pl-6 text-black text-center md:text-left">
          <p className="text-2xl md:text-3xl header-text leading-relaxed mb-4">
            Join us from <span className="font-medium">October 7th - 9th, 2025</span> for a transformative experience at ATINUDA 2025. We’re bringing together industry leaders, creative visionaries, and business decision-makers to explore the next frontier of luxury, events, and global influence.
          </p>
          <p className="text-sm md:text-base leading-relaxed mb-4">
            Secure your early access tickets now and be part of the conversations that matter. Limited in-person tickets are available at the following early bird rates:
          </p>
          <ul className="text-sm md:text-base leading-relaxed list-disc list-inside mb-4">
            <li>Member tickets from ₦250,000 + VAT & fees</li>
            <li>Non-member tickets from ₦450,000 + VAT & fees</li>
          </ul>
          <p className="text-sm md:text-base leading-relaxed mb-4">
            ATINUDA members, please email <a href="mailto:rsvp@atinuda.africa" className="text-[#ff7f41] underline">rsvp@atinuda.africa</a> to receive your exclusive access code.
          </p>
          <p className="text-sm md:text-base leading-relaxed mb-4">
            Early bird pricing is valid until <span className="font-medium">11:59 PM, July 1st, 2025</span>. Prices will increase after this date.
          </p>

          <div className="flex justify-center md:justify-start">
            <motion.button
              whileHover={{ backgroundColor: '#ff7f41' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative px-6 py-2 border border-gray-500 text-black nav-text font-medium uppercase overflow-hidden group"
            >
              <span className="relative z-10">Secure A Seat</span>
              <span className="absolute inset-0 w-0 bg-[#ff7f41] transition-all duration-300 group-hover:w-full"></span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummitAbout;
