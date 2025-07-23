"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BottomNav = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const hero = document.getElementById("hero");
        const header = document.getElementById("header");
        const bottomNav = document.getElementById("bottom-nav");

        if (!hero || !header || !bottomNav) return;

        const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
        const headerBottom = header.getBoundingClientRect().bottom + window.scrollY;
        const navHeight = bottomNav.offsetHeight;

        // Fix BottomNav when it reaches the bottom of HeaderNav
        setIsFixed(heroBottom - navHeight <= headerBottom);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="bottom-nav"
      className={`w-full z-50 transition-all duration-500 ${
        isFixed ? "fixed bottom-0 left-0" : "absolute bottom-0"
      }`}
    >
      {/* Background Overlay */}
      <motion.div className="absolute inset-0 bg-[#1B365D] opacity-35 -z-10" />

      {/* Navigation Menu */}
      <motion.nav className="relative nav-text w-full text-white uppercase p-4 flex justify-around items-center shadow-md tracking-wider">
        <NavItem href="/assets/docs/summit-report.pdf">
          {/* Mobile line break using Tailwind's block class */}
          <span className="block sm:inline">Download</span>{" "}
          <span className="block sm:inline">Summit Report</span>
        </NavItem>
        <NavItem href="/become-a-sponsor">
          <span className="block sm:inline">Become A</span>{" "}
          <span className="block sm:inline">Sponsor</span>
        </NavItem>
        <NavItem href="/https://atinuda.africa/membership/">
          <span className="block sm:inline">Invite</span>{" "}
          <span className="block sm:inline">Only</span>
        </NavItem>
      </motion.nav>
    </div>
  );
};

// Reusable Navigation Item Component
const NavItem: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <motion.span
        className="relative cursor-pointer text-sm sm:text-base text-center sm:whitespace-nowrap whitespace-pre-line"
        initial={{ backgroundSize: "0% 1px" }}
        whileHover={{ backgroundSize: "100% 1px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          backgroundImage: "linear-gradient(to right, white, white)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 100%",
          backgroundSize: "0% 1px",
          letterSpacing: "0.15em",
        }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

export default BottomNav;