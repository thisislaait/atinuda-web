"use client";

import { useEffect, useState, useRef } from "react";

const partners = [
  "/assets/images/Atafo2.png",
  "/assets/images/bellanaija.png",
  "/assets/images/livvytwist.png",
  "/assets/images/landmark.png",
];

const stats = [
  { category: "Fashion", percentage: 25 },
  { category: "Design", percentage: 20 },
  { category: "Lifestyle", percentage: 15 },
  { category: "Tech", percentage: 25 },
  { category: "Business", percentage: 15 },
];

const SummitSponsors = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(false);
  const [isScrollingLocked, setIsScrollingLocked] = useState(false); // Prevent rapid toggling
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Start fade-out effect
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % partners.length);
        setFade(false); // Start fade-in effect
      }, 500); // Change image halfway through fade-out
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (!sectionRef.current || !contentRef.current) return;

      const section = sectionRef.current;
      const content = contentRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if section is fully visible
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        if (!isScrollingLocked) {
          document.body.style.overflow = "hidden"; // Lock scrolling
          setIsScrollingLocked(true); // Prevent rapid toggling
        }

        // Allow scrolling inside content
        content.scrollTop += event.deltaY;

        // Enable normal scrolling if user reaches top or bottom
        if (content.scrollTop <= 0 && event.deltaY < 0) {
          document.body.style.overflow = "auto"; // Resume scrolling up
          setIsScrollingLocked(false);
        }

        if (content.scrollTop >= content.scrollHeight - content.clientHeight) {
          document.body.style.overflow = "auto"; // Resume scrolling down
          setIsScrollingLocked(false);
        }
      } else {
        if (isScrollingLocked) {
          document.body.style.overflow = "auto"; // Ensure normal scrolling outside
          setIsScrollingLocked(false);
        }
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [isScrollingLocked]);

  return (
    <section ref={sectionRef} className="w-full py-16 px-10 relative">
      {/* Section Title */}
      <h2
        className="text-xs text-black uppercase nav-text text-left pb-2 border-b border-black"
        style={{ letterSpacing: "0.3em" }}
      >
        Our Growing Community
      </h2>

      {/* Content Area */}
      <div className="container mx-auto flex flex-col md:flex-row mt-12 relative">
        {/* Left Side - Smooth Scroll Within Section */}
        <div className="md:w-3/5 pr-8 left-content h-[400px] overflow-hidden">
          <div ref={contentRef} className="pr-4 h-full overflow-hidden">
            <p className="text-2xl header-text text-black leading-relaxed">
              Atinuda is where the architects of luxury, culture, and innovation come together.  
              It’s a gathering for meaningful partnerships, bold ideas, and industry-shaping collaborations.  
              <br />
              <br />
              Our ecosystem thrives on visionaries—brands and leaders who drive change.  
              <br />
              <br />
            </p>

            <p className="text-sm text-black">
              We work with partners who redefine excellence, creating experiences that resonate across industries.
                
              <br />
              <br />
              Every partnership is a statement. Every connection is an opportunity.  
            </p>


            <div className="mt-6 space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-center gap-2.5 text-lg font-semibold text-black">
                  <span>{stat.category}</span>
                  <span>{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Smooth Image Transition */}
        <div className="md:w-2/5 h-[400px] relative">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
            style={{
              backgroundImage: `url(${partners[currentImage]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SummitSponsors;