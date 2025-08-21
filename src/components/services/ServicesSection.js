'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import serviceData from '@/data/services.json';
import { ServiceCard, SkeletonServiceCard } from './ServiceCard';

//
// ─── SERVICES GRID LAYOUT ─────────────────────────────────────────
//
const ServicesGrid = ({ services, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonServiceCard key={i} />
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">No Services Available</h3>
        <p>Services are currently being updated. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[350px] md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

//
// ─── MAIN SERVICES PAGE UI ────────────────────────────────────────
//
const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      const servicesData = serviceData.services || [];
      setServices(servicesData);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-20 xl:py-24 3xl:py-28">
      <div className="container">
        {/* Services Grid */}
        <ServicesGrid services={services} isLoading={isLoading} />
      </div>
    </div>
  );
};

//
// ─── CallToAction ────────────────────────────────────────────
//

const CallToAction = () => {
  return (
    <section className="py-16 xl:py-20 my-16 xl:my-20">
      <div className="container">
        <div className="bg-primary-card border-primary transition-300 hover:shadow-xl rounded-2xl p-8 xl:p-10 text-center">
          <h2 className="text-2xl xl:text-3xl font-bold text-gradient-1 mb-4">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-secondary">
            Let's discuss your project and create a tailored solution that drives results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Start Your Project
            </Link>
            <Link href="/projects" className="btn-secondary">
              View My Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ServicesList, CallToAction };
