"use client";

import { motion } from "framer-motion";
import Link from 'next/link';

const BecomeSponsor = () => {
  return (
    <section className="w-full px-10 py-8 mb-10">
      <div className="container mx-auto flex flex-col md:flex-row relative">
        {/* Left Side - Background Image */}
        <div
          className="md:w-[65%] h-[400px] bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/Sponsors.jpg')" }} // Replace with actual image path
        />

        {/* Right Side - Content */}
        <div className="md:w-[35%] flex flex-col justify-center pl-8">
          <h2 className="text-5xl hero-text text-black">Become <br /> <span> a Sponsor</span></h2>
          <div className="w-12 h-0.5 bg-black my-3" /> {/* Short Line */}
          <p className="text-sm text-black">
            For more information about becoming a sponsor, request a sponsorship pack here.
          </p>

          {/* Correct Button */}
          <div className="mt-6">
            <Link href="/become-a-sponsor" passHref>
              <motion.button
                whileHover={{ backgroundColor: "#ff7f41" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative px-6 py-2 border border-gray-500 text-black nav-text font-medium uppercase overflow-hidden group"
              >
                <span className="relative z-10">Request Sponsorship Pack</span>
                <span className="absolute inset-0 w-0 bg-[#ff7f41] transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSponsor;
