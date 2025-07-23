import BecomeSponsorForm from "../../components/ui/SponsorForm";
import Image from "next/image";


export default function BecomeSponsorPage() {
    return (
      <div id="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white p-6 sm:p-8">
                  {/* Background Image */}
                  <div className="absolute inset-0 -z-10">
                    <Image
                      src="/assets/images/bannerdesign.png"
                      alt="Hero Background"
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full bg-[#1f2340]"
                    />
                    <div className="absolute inset-0 bg-[#1f2340] opacity-60"></div>
                  </div>
                  
                  {/* Content Section */}
                  <BecomeSponsorForm />
          </div>
       
    );
  }
