'use client';

import faqData from '@/data/faqs.json';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

//
// ─── FAQ ITEM COMPONENT ───────────────────────────────────────────
//
const FaqItem = ({ faq, isOpen, toggleFaq }) => {
  return (
    <div
      className={`border-primary hover:shadow transition-300 rounded-xl overflow-hidden ${
        !isOpen ? 'bg-secondary-card' : 'bg-primary shadow'
      }`}
    >
      <button
        className="flex justify-between items-start text-left w-full p-6"
        onClick={toggleFaq}
        aria-expanded={isOpen}
      >
        <h3 className="text-primary text-lg font-semibold pr-4">{faq.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-2 mt-1.5"
        >
          <FaChevronDown className="text-primary" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <p>{faq.answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

//
// ─── SKELETON FAQ ITEM COMPONENT ─────────────────────────────────
//
const SkeletonFaqItem = () => {
  return (
    <div className="bg-secondary-card border-primary hover:shadow transition-300 rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className=" w-3/4 h-6 rounded-md skeleton-fields"></div>
        <div className="h-5 w-5 rounded-md skeleton-fields"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="w-full h-4 rounded-md skeleton-fields"></div>
        <div className="w-5/6 h-4 rounded-md skeleton-fields"></div>
        <div className="w-4/6 h-4 rounded-md skeleton-fields"></div>
      </div>
    </div>
  );
};

export { FaqItem, SkeletonFaqItem };

//
// ─── FAQ ACCORDION LAYOUT ─────────────────────────────────────────
//
const FaqAccordion = ({ faqs, isLoading }) => {
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonFaqItem key={i} />
        ))}
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4 text-secondary">No FAQs Available</h3>
        <p className="text-secondary">
          Frequently asked questions are currently being updated. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} isOpen={openFaqId === faq.id} toggleFaq={() => toggleFaq(faq.id)} />
      ))}
    </div>
  );
};

//
// ─── MAIN FAQ PAGE UI ────────────────────────────────────────────
//
const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      const faqsData = faqData.faqs || [];
      setFaqs(faqsData);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-20 xl:py-24 3xl:py-28 bg-secondary">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Frequently Asked Questions</h2>
          <p className="max-w-2xl mx-auto text-secondary">
            Find answers to common questions about my web development services. If you don't find what you're looking
            for, feel free to contact me directly.
          </p>
        </div>

        {/* FAQ Accordion */}
        <FaqAccordion faqs={faqs} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FaqList;
