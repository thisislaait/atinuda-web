"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const HeaderNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 600;
      setScrolled(window.scrollY > heroHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);

    // ✅ Preload menu background image
    const img = new window.Image();
    img.src = "/assets/images/menubanner.jpg";

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    window.location.href = path;
  };

  return (
    <>
      <header
        id="header"
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-8 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-4" : "bg-transparent py-8 md:py-6"
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src={
              scrolled
                ? "/assets/images/blacklogo.png"
                : "/assets/images/whitelogo.png"
            }
            alt="Logo"
            width={120}
            height={40}
            priority
            className="object-contain transition-all duration-300 cursor-pointer"
          />
        </Link>

        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="relative text-lg font-medium tracking-wider flex items-center"
        >
          {/* Hamburger Icon */}
          <div className="md:hidden flex flex-col space-y-1">
            <span
              className={`block w-6 h-[2px] transition-all duration-300 ${
                scrolled ? "text-black" : "text-white"
              } bg-current`}
            ></span>
            <span
              className={`block w-6 h-[2px] transition-all duration-300 ${
                scrolled ? "text-black" : "text-white"
              } bg-current`}
            ></span>
          </div>

          {/* "Menu" text */}
          <motion.span
            className="hidden md:block nav-text uppercase cursor-pointer tracking-wider transition-all duration-300 ml-2"
            initial={{ backgroundSize: "0% 1px" }}
            whileHover={{ backgroundSize: "100% 1px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              color: scrolled ? "black" : "white",
              backgroundImage: scrolled
                ? "linear-gradient(to right, black, black)"
                : "linear-gradient(to right, white, white)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: "0% 2px",
              letterSpacing: "0.15em",
            }}
          >
            Menu
          </motion.span>
        </button>
      </header>

      {/* Fullscreen Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full h-full bg-cover bg-center flex flex-col justify-center items-end pr-20 z-50"
          style={{ backgroundImage: "url('/assets/images/menubanner.jpg')" }}
        >
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 right-10 text-lg tracking-wider nav-text text-white uppercase"
            style={{ letterSpacing: "0.3em" }}
          >
            Close
          </button>

          {/* Navigation Menu */}
          <nav className="flex flex-col space-y-6 text-white text-4xl header-text h-full justify-center">
            {[
              "Our Story",
              "Membership",
              "Brands Activation",
              "Spark The Future 2025",
              "Regional Events",
            ].map((item, index) => {
              const path = `/${item.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <motion.span
                  key={index}
                  initial={{ backgroundSize: "0% 1px" }}
                  whileHover={{ backgroundSize: "100% 1px" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    backgroundImage: "linear-gradient(to right, white, white)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0 100%",
                    backgroundSize: "0% 1px",
                  }}
                >
                  <span
                    className="block cursor-pointer"
                    onClick={() => handleNavClick(path)}
                  >
                    {item}
                  </span>
                </motion.span>
              );
            })}
          </nav>
        </motion.div>
      )}
    </>
  );
};

export default HeaderNav;


