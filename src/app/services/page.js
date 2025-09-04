import Link from 'next/link';
import services from '@/data/services.json';
import { ChevronsRight } from 'lucide-react';
import { FAQItem } from '@/components/services/FAQItem';
import { ServiceCard } from '@/components/services/ServiceCard';

export const metadata = {
  title: 'Professional Services - Web Development & More',
  description:
    'Explore our comprehensive range of professional services including web development, e-commerce solutions, CMS development, and more. Quality work delivered on time.',
};

const ServicesPage = () => {
  return (
    <div>
      {/* Main Header */}
      <div className="bg-secondary flex-col-center text-center h-[450px] xl:h-[500px] 3xl:h-[550px] pt-10 xl:pt-12 3xl:pt-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-9 2xl:px-12 3xl:px-16">
        <div className="flex-center font-semibold lg-subtitle relative max-w-max mx-auto px-0.5 space-x-2 xl:text-lg 3xl:text-xl">
          <span className="text-gradient">Home</span>
          <ChevronsRight className="text-tertiary mt-1 pointer-events-none size-5 xl:size-6 3xl:size-6.5" />
          <span className="text-gradient-1">Services List</span>
        </div>

        <h1 className="text-gradient-1 text-5xl xl:text-6xl 3xl:text-7xl my-6">Services</h1>

        <p className="max-w-2xl mx-auto text-center xl:text-[17px]">
          I offer comprehensive web development solutions tailored to your business needs. From concept to launch, I
          ensure your online presence stands out with modern design and cutting-edge functionality.
        </p>
      </div>

      {/* Services Grid --------------------------------------- */}
      {!services.card || services.card.length === 0 ? (
        <section className="text-center py-12">
          <h3 className="text-primary text-2xl mb-2">No Services Available</h3>
          <p>Services are currently being updated. Please check back later.</p>
        </section>
      ) : (
        <section className="container py-20 xl:py-24">
          <div className="3xl:py-28 max-w-[350px] md:max-w-3xl xl:max-w-full mx-auto grid gap-6 md:gap-10 3xl:gap-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {services.card.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* Process --------------------------------------- */}
      <section className="py-20 bg-secondary">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl mt-4 mb-2 text-gradient">How I Work With You</h2>
            <p className="max-w-3xl mx-auto">A streamlined process designed to deliver exceptional results</p>
          </div>

          <div className="mx-auto">
            {services.process.map((step, index) => (
              <div key={index} className="mb-12 lg:mb-20">
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="bg-primary p-6 border-primary rounded-xl shadow hover:shadow-lg transition-300 hover:-translate-y-1 hover:border-none">
                    <div className="mb-4 flex">
                      <span className="bg-gradient text-white rounded-md size-7 flex-center font-bold text-lg mr-4 mt-0.5">
                        {index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-gradient-1">{step.title}</h3>
                    </div>
                    <p className="leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section --------------------------------------- */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12 xl:mb-16">
            <h2 className="text-gradient-1 text-4xl xl:text-5xl 3xl:text-6xl font-bold mb-6">
              Frequently Asked Questions Test
            </h2>
            <p className="text-secondary xl:text-lg max-w-3xl mx-auto">
              Find answers to common questions about our web development services, process, and what to expect when
              working with us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 xl:space-y-6">
            {services.faqs?.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action --------------------------------------- */}
      <section className="py-16 xl:py-20">
        <div className="container">
          <div className="bg-secondary border-primary transition-300 hover:shadow-xl rounded-2xl p-8 xl:p-10 text-center">
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
    </div>
  );
};

export default ServicesPage;
