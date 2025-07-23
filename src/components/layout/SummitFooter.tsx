import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Linkedin, Twitter } from 'lucide-react'; // Lucide Icons

const SummitFooter = () => {
  // Navigation Links
  const navLinks = [
    { name: 'Membership', path: '/membership' },
    { name: 'Careers', path: '/careers' },
    { name: 'Corporate Responsibility', path: '/corporate-responsibility' },
    { name: 'Press', path: '/press' },
    { name: 'Spark the Future', path: '/spark-the-future' },
  ];

  // Social Links with ARIA labels
  const socialLinks = [
    { icon: <Instagram size={24} />, url: 'https://instagram.com/atinuda_', label: 'Instagram' },
    { icon: <Linkedin size={24} />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Twitter size={24} />, url: 'https://twitter.com', label: 'Twitter' },
  ];

  // Legal Links
  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Legal', path: '/legal' },
  ];

  return (
    <footer className="w-full text-black py-8 bg-gray-100">
      <div className="relative w-full h-[400px]">
              <Image
                src="/assets/images/elementthree.png"
                alt="Footer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 z-10" />
              <div className="container mx-auto px-6">
        
              {/* Logo Section */}
              <section className="flex flex-col items-center">
              <Link href="/">
                <Image 
                  src="/assets/images/blacklogo.png" 
                  alt="Logo" 
                  width={120} 
                  height={40} 
                  priority 
                  className="object-contain transition-all duration-300 cursor-pointer"
                />
              </Link>
                <hr className="w-full border-black my-3" />
              </section>

              {/* Navigation Links */}
              <nav className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-xs font-medium my-8 mx-3 uppercase">
                {navLinks.map((link, index) => (
                  <Link key={index} href={link.path} className="hover:underline transition duration-200">
                    {link.name}
                  </Link>
                ))}
              </nav>
              <hr className="w-full border-black my-3" />

              {/* Social & Legal Section */}
              <section className="flex flex-col md:flex-row items-center justify-between space-y-4 pb-16 px-8">
                {/* Social Icons */}
                <div className="flex space-x-4">
                  {socialLinks.map(({ icon, url, label }, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-gray-500 transition">
                      {icon}
                    </a>
                  ))}
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-600">© {new Date().getFullYear()} Atinuda. All rights reserved.</p>

                {/* Legal Links */}
                <div className="text-xs flex space-x-4">
                  {legalLinks.map((link, index) => (
                    <Link key={index} href={link.path} className="hover:underline transition duration-200">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
      

      </div>
    </footer>
  );
};

export default SummitFooter;


