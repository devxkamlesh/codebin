import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CodePreview from '../components/landing/CodePreview';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CodePreview />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
} 