"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const HeaderNav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNoHero, setHasNoHero] = useState(false);
  const [isSolid, setIsSolid] = useState(false); // controls bg + text color (black when true)

  // Re-evaluate on route change
  useEffect(() => {
    const recompute = () => {
      const noHero = !!document.getElementById("nohero");
      setHasNoHero(noHero);
      // If there's no hero, header is solid immediately; if there is, solid only after scroll
      setIsSolid(noHero || window.scrollY > 0);
    };

    recompute();
    const t = setTimeout(recompute, 80); // in case DOM updates a tick later
    return () => clearTimeout(t);
  }, [pathname]);

  // Scroll behavior for pages WITH hero
  useEffect(() => {
    if (hasNoHero) return; // solid always, no scroll handling needed
    const onScroll = () => setIsSolid(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNoHero, pathname]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    window.location.href = path;
  };

  const logoSrc = isSolid
    ? "/assets/images/blacklogo.png"
    : "/assets/images/whitelogo.png";

  // Solid white + blur when isSolid; otherwise transparent
  const headerBg = isSolid
    ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
    : "bg-transparent";

  return (
    <>
      <header
        id="header"
        className={`fixed top-0 left-0 w-full flex justify-between items-center px-8 z-50 transition-all duration-300 ${headerBg} ${
          hasNoHero ? "py-4" : "py-8 md:py-6"
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src={logoSrc}
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
          {/* Hamburger (mobile) */}
          <div className="md:hidden flex flex-col space-y-1">
            <span className={`block w-6 h-[2px] ${isSolid ? "bg-black" : "bg-white"}`} />
            <span className={`block w-6 h-[2px] ${isSolid ? "bg-black" : "bg-white"}`} />
          </div>

          {/* “Menu” (desktop) */}
          <motion.span
            className="hidden md:block nav-text uppercase cursor-pointer tracking-wider transition-all duration-300 ml-2"
            initial={{ backgroundSize: "0% 1px" }}
            whileHover={{ backgroundSize: "100% 1px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              color: isSolid ? "black" : "white",
              backgroundImage: `linear-gradient(to right, ${isSolid ? "black" : "white"}, ${isSolid ? "black" : "white"})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: "0% 2px",
              letterSpacing: "0.15em",
              textShadow: !isSolid ? "0 0 8px rgba(0,0,0,0.35)" : "none",
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
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 right-10 text-lg tracking-wider nav-text text-white uppercase"
            style={{ letterSpacing: "0.3em" }}
          >
            Close
          </button>

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
                  <span className="block cursor-pointer" onClick={() => handleNavClick(path)}>
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
