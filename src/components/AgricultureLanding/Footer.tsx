"use client"

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

  return (
    <footer className="flex flex-col items-center self-stretch w-full bg-neutral-900">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-6">
        <div className="flex flex-col w-full max-w-[1226px] mx-auto">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
              <img
                loading="lazy"
                src={`${NEXT_PUBLIC_CDN_URL}/logo.svg` || "/logo.svg"}
                alt="UCS GROUP logo"
                className="object-contain shrink-0 aspect-square w-[80px] md:w-[20vw]"
              />
            </div>

            <div className="flex flex-col items-center md:items-start text-stone-300 text-sm md:ml-10">
              <div className="leading-6 text-center md:text-left max-w-[60vw] md:max-w-[15vw]">
                Meydan Grandstand, 6th floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.
              </div>
              <div className="mt-4 leading-6 text-center md:text-left">
                Phone: +966 54 402 3149
              </div>
              <div className="mt-4 leading-6 text-center md:text-left">
                Email: info@ucsgroupllc.com
              </div>

              {/* Social media icons */}
              <div className="flex gap-4 mt-6 md:mt-8">
                <FaFacebookF className="text-white text-lg hover:text-blue-400 cursor-pointer" />
                <FaTwitter className="text-white text-lg hover:text-blue-400 cursor-pointer" />
                <FaInstagram className="text-white text-lg hover:text-blue-400 cursor-pointer" />
                <FaLinkedinIn className="text-white text-lg hover:text-blue-400 cursor-pointer" />
                <FaYoutube className="text-white text-lg hover:text-blue-400 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="self-center mt-10 md:mt-14 text-sm leading-6 text-center text-white">
          <span>© Copyright </span>
          <span className="font-bold">UCS GROUP</span>
          <span>. All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;