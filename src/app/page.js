import Link from 'next/link';
import Image from 'next/image';
import { FileText, ArrowRight, ArrowUpRight } from 'lucide-react';
import FeaturedProjects from '@/components/projects/FeaturedProjects.js';
import FeaturedServices from '@/components/services/FeaturedServices.js';

const HomePage = () => {
  return (
    <main>
      {/* # HOME SECTION # */}
      <section className="pt-28 sm:pt-32 md:pt-50 3xl:pt-60 pb-20 xl:pb-36 3xl:pb-50">
        <div className="container flex flex-col items-center gap-13 md:flex-row-reverse md:justify-between">
          <div
            className="hero-profile flex-center relative overflow-hidden rounded-full aspect-square
              p-[3px] xl:p-[3.5px] 2xl:p-[4px] 3xl:p-[5px] w-[88%] max-w-[315px]
              xl:w-full xl:max-w-[350px] 2xl:max-w-[380px] 3xl:max-w-[400px]"
          >
            <div className="bg-primary flex-center overflow-hidden rounded-full transition-500 z-10 size-full">
              <Image src="/hero.png" alt="nawaz profile" fill className="transform translate-y-5" />
            </div>
          </div>

          <div className="sm:text-center md:text-left">
            <h4 className="text-tertiary font-black sm:font-extrabold text-base xl:text-lg 3xl:text-xl">
              Hello<i className="pl-1 text-gradient">Everyone</i>!
            </h4>
            <h1 className="text-primary mt-2 text-5xl xl:text-6xl 3xl:text-[65px]">
              I'm<i className="text-gradient pl-1">Nawaz</i>
            </h1>
            <h4 className="text-primary font-roboto font-medium mt-2.5 text-lg xl:text-xl 3xl:text-[1.35rem]">
              Full-Stack Website Developer
            </h4>
            <p className="mt-3 xl:text-[17px] 3xl:text-lg sm:max-w-[600px] md:max-w-[485px] xl:max-w-[530px] 3xl:max-w-[550px]">
              I design and develop user-friendly web solutions that are fast, responsive, secure, and work seamlessly
              across all devices. I transform your ideas into reality with clean, efficient code.
            </p>
            <div className="flex flex-wrap gap-6 mt-8 sm:justify-center md:justify-start">
              <Link href="/contact" className="btn-primary rounded-full">
                Let's Work Together
              </Link>
              <Link href="/works" className="btn-secondary rounded-full">
                See My Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* # ABOUT SECTION # */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-10 xl:mb-12 3xl:mb-14">
            <h4 className="subtitle text-primary relative max-w-max mx-auto px-0.5 xl:text-lg 3xl:text-xl">About Me</h4>

            <h2 className="text-gradient-1 my-2.5 text-4xl xl:text-5xl 3xl:text-[55px]">Why Hire Me?</h2>
          </div>

          <div className="mx-3 text-center grid gap-8 md:grid-cols-2 3xl:gap-16">
            {/* # MY JOURNEY # */}
            <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300">
              <div
                className="content bg-secondary-card border-primary flex-col-center transition-300 
                overflow-hidden rounded-xl hover:border-transparent w-full h-full py-7 px-5 xl:px-8 z-10"
              >
                <h3 className="text-primary mb-3 text-2xl xl:text-3xl 3xl:text-[35px]">My Journey</h3>
                <p className="font-medium text-sm xl:text-base 3xl:text-[17px]">
                  I have over 6 years of experience in web development, working with both front-end and back-end
                  technologies like HTML, CSS, JavaScript, React, Tailwind CSS, Node.js, Express.js, MongoDB, Next.js,
                  React Native and more. I'm passionate about staying updated with the latest trends and continuously
                  expanding my skill set to deliver innovative solutions.
                </p>
                <Link href="/components/resume" className="btn-secondary flex-center gap-2 w-9/12 sm:w-1/2 mt-8 py-3">
                  <FileText strokeWidth={2.5} className="size-4" />
                  My Resume
                </Link>
              </div>
            </div>

            {/* # MY EXPERTISE # */}
            <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300">
              <div
                className="content bg-secondary-card border-primary flex-col-center transition-300 
                  overflow-hidden rounded-xl hover:border-transparent w-full h-full py-7 px-5 xl:px-8 z-10"
              >
                <h3 className="text-primary mb-3 text-2xl xl:text-3xl 3xl:text-[35px]">My Expertise</h3>
                <p className="font-medium text-sm xl:text-base 3xl:text-[17px]">
                  I create high-performance, responsive web solutions for many industries including business services,
                  online stores, portfolios, corporate websites, blogs, one-page sites, restaurants, events, and more.
                  By focusing on each client's unique needs, I deliver projects that boost engagement and help achieve
                  business goals.
                </p>
                <Link href="/about" className="btn-secondary flex-center gap-2 w-9/12 sm:w-1/2 mt-8 py-3">
                  Learn More
                  <ArrowRight strokeWidth={2.5} className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-10 xl:mb-12 3xl:mb-14 xl:text-left xl:flex xl:items-end xl:justify-between">
            <div>
              <h4 className="subtitle text-primary relative max-w-max mx-auto xl:mx-0 px-0.5 xl:text-lg 3xl:text-xl">
                Featured Projects
              </h4>

              <h2 className="text-gradient-1 my-2.5 xl:mb-0 text-4xl xl:text-5xl 3xl:text-[55px]">My Recent Work</h2>
            </div>

            <Link href="/projects" className="btn-primary hidden max-w-max xl:flex md:gap-2 group">
              View All Projects
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <FeaturedProjects limit={6} />
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-10 xl:mb-12 3xl:mb-14 xl:text-left xl:flex xl:items-end xl:justify-between">
            <div>
              <h4 className="subtitle text-primary relative max-w-max mx-auto xl:mx-0 px-0.5 xl:text-lg 3xl:text-xl">
                My Services
              </h4>

              <h2 className="text-gradient-1 my-2.5 xl:mb-0 text-4xl xl:text-5xl 3xl:text-[55px]">
                What I Do for Clients
              </h2>
            </div>

            <Link href="/services" className="btn-primary hidden max-w-max xl:flex md:gap-2 group">
              View All Services
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <FeaturedServices />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
