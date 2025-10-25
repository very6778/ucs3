import { Metadata } from "next";
import dynamic from 'next/dynamic';
import Hero from "../components/AgricultureLanding/Hero";
const DiscoverSection = dynamic(() => import('@/components/AgricultureLanding/OurProduct'));
const Gallery = dynamic(() => import('@/components/AgricultureLanding/Gallery/Gallery'));
const OperationMap = dynamic(() => import('../components/AgricultureLanding/OperationMap'));
const OurAdvantages = dynamic(() => import('@/components/AgricultureLanding/OurAdvantages'));
const CardsComponent = dynamic(() => import('../components/AgricultureLanding/CardsComponent'));
const ContactForm = dynamic(() => import('../components/AgricultureLanding/ContactForm'));
import OurMission from "@/components/AgricultureLanding/OurMissionHome";
const Footer = dynamic(() => import('@/components/AgricultureLanding/Footer'));

export const metadata: Metadata = {
  title: "Home | UCS Agriculture",
  description: "Welcome to UCS Agriculture - Sustainable farming solutions",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center pt-8 w-full mx-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Hero />
        <OurMission />
        <DiscoverSection />
      </div>
      <div className="w-full overflow-hidden">
        <Gallery />
      </div>
      <OperationMap />
      <OurAdvantages />
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-18 sm:mt-24 lg:mt-36">
        <CardsComponent />
      </div>
      <ContactForm />
      <Footer />
    </div>
  );
}
