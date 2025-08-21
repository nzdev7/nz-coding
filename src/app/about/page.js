// import PackagePlansPage from '@/components/packages/PackagePlans';
// import FaqPageUI from '@/components/faqs/FaqPage';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <>
      <div className="min-h-screen flex-col-center">
        <h1 className="text-primary text-5xl xl:text-6xl 3xl:text-[4.05rem]">
          About<i>Page</i>
        </h1>

        {/* <div className="mt-20">
          <PackagePlansPage />
        </div>

        <div className="mt-20">
          <FaqPageUI />
        </div> */}

        {/* Call to Action */}
        <div className="text-center mt-16 xl:mt-20">
          <div className="bg-secondary-card border border-primary rounded-2xl p-8 xl:p-10">
            <h3 className="text-2xl xl:text-3xl font-bold text-gradient-1 mb-4">Ready to Get Started?</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Let's discuss your project and find the perfect solution for your business needs. I'm here to help bring
              your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary rounded-xl px-6 py-3">
                Start Your Project
              </Link>
              <Link href="/projects" className="btn-secondary rounded-xl px-6 py-3">
                View My Work
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 xl:mt-20">
          <div className="bg-secondary-card border border-primary rounded-2xl p-8 xl:p-10">
            <h3 className="text-2xl xl:text-3xl font-bold text-gradient-1 mb-4">Still Have Questions?</h3>
            <p className="mb-6 max-w-2xl mx-auto text-secondary">
              I'm here to help! Contact me for more information about my services or to discuss your specific project
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary rounded-xl px-6 py-3">
                Get In Touch
              </Link>
              <Link href="/projects" className="btn-secondary rounded-xl px-6 py-3">
                View My Work
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 xl:mt-20">
          <div className="bg-secondary-card border border-primary rounded-2xl p-8 xl:p-10">
            <h3 className="text-2xl xl:text-3xl font-bold text-gradient-1 mb-4">Need a Custom Solution?</h3>
            <p className="mb-6 max-w-2xl mx-auto text-secondary">
              Don't see a package that fits your needs? I can create a custom solution tailored specifically to your
              business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@example.com" className="btn-primary rounded-xl px-6 py-3">
                Request Custom Quote
              </a>
              <a href="tel:+1234567890" className="btn-secondary rounded-xl px-6 py-3">
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
