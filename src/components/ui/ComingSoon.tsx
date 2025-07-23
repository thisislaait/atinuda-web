'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Countdown target date
const targetDate = new Date('2025-10-07T00:00:00');

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown(); // Run initially
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-16 bg-black">
      {/* Background Image */}
      <Image
        src="/assets/images/elementfive.png"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Countdown Timer */}
        <div className="text-white text-center md:text-left w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">See you at Atinuda</h2>
          <div className="flex justify-center md:justify-start space-x-6 text-xl font-mono">
            <div>
              <p className="text-5xl font-bold">{timeLeft.days}</p>
              <p className="text-sm text-white/70">Days</p>
            </div>
            <div>
              <p className="text-5xl font-bold">{timeLeft.hours}</p>
              <p className="text-sm text-white/70">Hours</p>
            </div>
            <div>
              <p className="text-5xl font-bold">{timeLeft.minutes}</p>
              <p className="text-sm text-white/70">Minutes</p>
            </div>
            <div>
              <p className="text-5xl font-bold">{timeLeft.seconds}</p>
              <p className="text-sm text-white/70">Seconds</p>
            </div>
          </div>
        </div>

        {/* Text Block */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h1 className=" hero-text text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">
            Coming Soon
          </h1>
          <p className="text-white/90 text-lg mb-6">
            We’re crafting something exceptional behind the scenes — an experience worthy of your attention.
          </p>
          <p className="text-white/70 text-sm">
            Sign up to be the first to know when we go live. Exclusive previews. Priority access. The Atinuda way.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoon;

