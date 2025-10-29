"use client"

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const logoSrc = "/logo.webp";

  return (
    <footer className="flex flex-col items-center self-stretch w-full -mt-[30px] bg-[linear-gradient(to_top,rgba(251,191,36,0.3825)_0%,rgba(254,243,199,0.19125)_47%,rgba(255,255,255,1)_70%)]">
      {/* Top fade removed to avoid double-gradient seam; contact section handles the blend */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 md:pt-0 pb-1">
        <div className="flex flex-col w-full max-w-[1226px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
              <img
                loading="lazy"
                src={logoSrc}
                alt="UCS GROUP logo"
                className="object-contain shrink-0 aspect-square w-[90px] md:w-[23vw]"
              />
            </div>

            <div className="flex flex-col items-center md:items-start text-neutral-700 text-sm md:ml-10">
              <div className="leading-6 text-center md:text-left max-w-[60vw] md:max-w-[15vw]">
                Atatürk Mah. Ertuğrul Gazi Sk. Metropol İstanbul Sitesi A Blok<br />
                No: 2E İç Kapı No: 331 Ataşehir / İstanbul
              </div>
              <div className="mt-4 leading-6 text-center md:text-left">
                Phone: +212 559 9290
              </div>
              <div className="mt-4 leading-6 text-center md:text-left">
                Email: info@ucscogroup.com
              </div>

              {/* Social media icons */}
              <div className="flex gap-4 mt-6 md:mt-8">
                <FaFacebookF className="text-neutral-600 text-lg hover:text-amber-500 cursor-pointer" />
                <FaTwitter className="text-neutral-600 text-lg hover:text-amber-500 cursor-pointer" />
                <FaInstagram className="text-neutral-600 text-lg hover:text-amber-500 cursor-pointer" />
                <FaLinkedinIn className="text-neutral-600 text-lg hover:text-amber-500 cursor-pointer" />
                <FaYoutube className="text-neutral-600 text-lg hover:text-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="self-center mt-2 md:mt-3 text-sm leading-6 text-center text-neutral-700">
          <span>© Copyright </span>
          <span className="font-bold">UCS GROUP</span>
          <span>. All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;