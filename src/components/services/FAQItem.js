'use client';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

//
// ─── FAQ ITEM COMPONENT ───────────────────────────────────────────
//
export const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const faqRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the FAQ item
    const handleClickOutside = (event) => {
      if (faqRef.current && !faqRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the FAQ item is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Only re-run the effect if isOpen changes

  return (
    <motion.div
      ref={faqRef}
      className="border-primary rounded-xl overflow-hidden shadow-secondary transition-300 hover:shadow-primary"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 xl:px-7 xl:py-6 bg-primary hover:bg-secondary transition-300 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-primary font-bold text-lg xl:text-xl pr-6 group-hover:text-tertiary transition-300">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-tertiary flex-shrink-0"
        >
          <FaChevronDown className="size-5 xl:size-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.3, delay: 0.15 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden bg-secondary border-t border-gray-200 dark:border-slate-600"
          >
            <motion.div
              className="px-6 py-6 xl:px-7 xl:py-7"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-secondary leading-relaxed xl:text-lg">{faq.answer}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
