"use client";
import * as React from "react";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="overflow-hidden px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-8 md:py-16 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="px-4 sm:px-8 md:px-16 py-8 md:py-14 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-none text-center text-lime-700 bg-lime-50 rounded-[20px] md:rounded-[44px]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Who we are?
        </motion.h1>
      </header>

      <motion.article
        className="flex flex-col px-8 sm:px-12 pt-10 md:pt-14 pb-12 md:pb-24 mt-6 md:mt-9 rounded-[20px] md:rounded-[44px]"
        style={{ backgroundColor: "#4d7c0f" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="self-start text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] md:leading-[1.3] lg:leading-[64px] mb-8 md:mb-14"
        >
          <span
            style={{
              fontWeight: 300,
              fontSize: "clamp(24px, 5vw, 48px)",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            We are
          </span>
          <br />
          UCS Group
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col text-xl md:text-2xl font-light leading-loose text-white"
          >
            <div className="h-full flex flex-col justify-between">
              <p>
                Our company is a new venture operating in the field of <strong className="text-lime-200">international trade</strong>, establishing a reliable supply network that connects producers directly with consumers.
              </p>
              <p className="mt-8">
                We adopt a business model that <strong className="text-lime-200">minimizes intermediaries</strong> to offer our customers the highest quality agricultural products at competitive prices.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col text-xl md:text-2xl font-light leading-loose text-white"
          >
            <div className="h-full flex flex-col justify-between">
              <p>
                Our supply processes are built on sourcing directly from production points, optimizing costs, and providing <strong className="text-lime-200">sustainable price advantages</strong>.
              </p>
              <p className="mt-8">
                Our business model is founded on <strong className="text-lime-200">transparency</strong>, sustainability, and long-term partnerships, with all operations following international standards.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.article>
    </motion.section>
  );
};

export default AboutUs;
