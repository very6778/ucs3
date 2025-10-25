"use client"
import type React from "react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ReactSignature } from "@/components/eldoraui/signature";

function useIsChrome() {
  const [isChrome, setIsChrome] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(ua) && !/Edg|OPR/.test(ua);
    setIsChrome(isChromeBrowser);
  }, []);

  return isChrome;
}

interface FormInputProps {
  label: string
  type: "text" | "email" | "password" | "tel"
  placeholder: string
}

const FormInput: React.FC<FormInputProps> = ({ label, type, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="mb-2 text-sm font-light tracking-wide text-black block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-amber-50 p-3 w-full text-sm rounded-xl border-solid border-[0.368px] border-neutral-400 text-neutral-400"
      />
    </div>
  )
}

interface FormTextareaProps {
  label: string
  placeholder: string
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, placeholder }) => {
  return (
    <div className="mb-5">
      <label className="mb-2 text-sm font-light tracking-wide text-black block">{label}</label>
      <textarea
        placeholder={placeholder}
        className="bg-amber-50 p-3 w-full text-sm rounded-xl border-solid resize-none border-[0.368px] border-neutral-400 h-[89px] text-neutral-400"
      />
    </div>
  )
}

const SubmitButton: React.FC<{ isSubmitting: boolean; isSuccess: boolean }> = ({ isSubmitting, isSuccess }) => {
  const getButtonText = () => {
    if (isSubmitting) return "Sending"
    if (isSuccess) return "Sent"
    return "Send"
  }

  const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

  return (
    <motion.button
      className="flex overflow-hidden gap-2 md:gap-6 justify-center items-center py-2 pl-4 md:pl-6 pr-2 bg-amber-300 rounded-[58px] h-fit"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: [0.215, 0.61, 0.355, 1],
        },
      }}
      whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.95 }}
      disabled={isSubmitting}
    >
      <motion.div
        className="text-sm md:text-base font-bold leading-snug text-black font-poppins"
        key={getButtonText()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {getButtonText()}
      </motion.div>

      <div className="flex justify-center items-center self-stretch px-2 w-8 h-8 md:w-10 md:h-10 bg-black rounded-[100px]">
        {isSubmitting ? (
          <motion.div
            className="w-4 md:w-6 h-4 md:h-6 border-2 border-amber-300 border-t-transparent rounded-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              rotate: 360
            }}
            transition={{
              opacity: { duration: 0.2 },
              rotate: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }
            }}
          />
        ) : isSuccess ? (
          <motion.svg
            className="w-4 md:w-6 h-4 md:h-6 text-amber-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </motion.svg>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <motion.img
              loading="lazy"
              src={`${NEXT_PUBLIC_CDN_URL}/arrow.svg`}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = "/arrow.svg";
              }}
              alt="Button icon"
              className="w-4 md:w-6 h-4 md:h-6"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>
        )}
      </div>
    </motion.button>
  )
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  const isChrome = useIsChrome();

  return (
    <form className="p-4 sm:p-6 rounded-2xl w-full" onSubmit={handleSubmit}>
      <h2 className="mb-5 text-xl sm:text-2xl font-semibold tracking-tighter text-stone-900">Get in touch with us</h2>
      <FormInput label="Name" type="text" placeholder="Name" />
      <FormInput label="E-Mail" type="email" placeholder="you@company.com" />
      <FormTextarea label="Your Message" placeholder="Leave us a message" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4 mt-4">
        <div className="w-full md:w-2/3">
          {isChrome ? (
            <ReactSignature />
          ) : (
            <p className="text-sm text-neutral-400 max-w-25">Signature is only supported on Chrome.</p>
          )}
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <SubmitButton isSubmitting={isSubmitting} isSuccess={isSuccess} />
        </div>
      </div>
    </form>
  )
}

const ContactPage: React.FC = () => {
  return (
    <div id="contact" className="relative w-full min-h-screen flex flex-col">
      <div className="mx-auto w-[92%] bg-amber-200 bg-opacity-80 h-[20px] sm:h-[27px] rounded-[30px_30px_0_0] sm:rounded-[50px_50px_0_0]" />
      <div className="mx-auto w-[97%] bg-amber-200 h-[25px] sm:h-[34px] rounded-[30px_30px_0_0] sm:rounded-[50px_50px_0_0]" />
      <main className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 w-full bg-amber-50 flex-1 rounded-[30px_30px_0_0] sm:rounded-[50px_50px_0_0]">
        <h1 className="mb-6 sm:mb-8 md:mb-10 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center text-neutral-800">
          Get In Touch
        </h1>
        <div className="flex flex-col lg:flex-row justify-between items-center max-w-[1200px] mx-auto gap-6 md:gap-8">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="pt-[42px] lg:pt-0">
              <div className="relative">
                <div
                >
                  <iframe
                    src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Atat%C3%BCrk%20Mah.%20Ertu%C4%9Frul%20Gazi%20Sk.%20Metropol%20%C4%B0stanbul%20Sitesi%20A%20Blok%20No%3A%202E%20%C4%B0%C3%A7%20Kap%C4%B1%20No%3A%20331%20Ata%C5%9Fehir%20%2F%20%C4%B0stanbul+(UCS)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                    className="w-full h-[300px] md:h-[430px] rounded-[20px] sm:rounded-[30px]"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[450px] order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ContactPage