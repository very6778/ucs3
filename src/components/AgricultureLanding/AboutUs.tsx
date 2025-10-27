"use client";
import * as React from "react";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="w-full bg-gradient-to-b from-[#FEF4CF] via-[#FEF7DC] to-white px-4 sm:px-6 md:px-8 pt-2 md:pt-4 pb-4 md:pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="px-1 sm:px-2 md:px-0"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="mt-[80px]">
              <motion.h1
                className="font-merryweather text-[2.8rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.9rem] tracking-normal leading-snug text-neutral-900"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45 }}
              >
                <span className="block font-light text-[1rem] sm:text-[1.24rem] md:text-[1.52rem] lg:text-[1.76rem] leading-none tracking-[0.01em] mb-0">Who we are?</span>
                <span className="block -mt-1 font-bold font-poppins text-[1.96rem] sm:text-[2.38rem] md:text-[2.94rem] lg:text-[3.43rem]">UCS Group</span>
              </motion.h1>
              <motion.p
                className="mt-4 sm:mt-6 text-[1.0625rem] sm:text-[1.1875rem] md:text-[1.3125rem] lg:text-[1.3625rem] text-neutral-600 leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45 }}
              >
                We connect producers to global demand with reliable, cost‑effective supply across agriculture and construction, built on transparency, quality and sustainability.
              </motion.p>
              <motion.p
                className="mt-4 text-neutral-600 text-[1.0625rem] sm:text-[1.1875rem] leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: 0.05 }}
              >
                Our model minimizes intermediaries, ensures standards‑compliant sourcing, and delivers on‑time with full quality assurance.
              </motion.p>
            </div>

            <motion.div
              className="relative w-full justify-self-stretch aspect-[1/1] rounded-3xl overflow-hidden mt-4 md:mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/about-who.webp"
                alt="UCS Group overview"
                className="w-full h-full object-cover object-center"
                style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.12))" }}
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
