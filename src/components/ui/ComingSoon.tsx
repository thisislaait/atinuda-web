'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const ComingSoon = () => {
  return (
    <section className="w-full min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
        {/* Left Column - Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/assets/images/Mulberry.jpg"
            alt="Coming Soon"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-auto shadow-xl"
          />
        </div>

        {/* Right Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-5xl hero-text text-black mb-6 leading-tight">
            Coming Soon
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            We’re crafting something exceptional behind the scenes — an experience worthy of your attention.
          </p>
          <p className="text-gray-500 text-sm">
            Sign up to be the first to know when we go live. Exclusive previews. Priority access. The Atinuda way.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoon;
