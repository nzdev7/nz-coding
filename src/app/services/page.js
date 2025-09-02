import { ChevronsRight } from 'lucide-react';
import FaqList from '@/components/services/ServicesFaq';
import { ServicesList, CallToAction } from '@/components/services/SercicesGrid';

export const metadata = {
  title: 'Professional Services - Web Development & More',
  description:
    'Explore our comprehensive range of professional services including web development, e-commerce solutions, CMS development, and more. Quality work delivered on time.',
};

const ServicesPage = () => {
  return (
    <div>
      {/* Header */}
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

      <ServicesList />

      <FaqList />

      <CallToAction />
    </div>
  );
};

export default ServicesPage;
