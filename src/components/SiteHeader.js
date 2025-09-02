'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from '../hooks/useTheme';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Services', path: '/services' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

const SiteHeader = () => {
  const pathname = usePathname();

  const [isNavActive, setNavActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Handle mobile detection
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 960);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Handle scroll behavior
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 150);
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 150);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Apply overflow hidden only on mobile when nav is active
  useEffect(() => {
    if (!isDesktop) {
      document.body.style.overflow = isNavActive ? 'hidden' : 'auto';
    }
  }, [isNavActive, isDesktop]);

  return (
    <header
      className={`bg-secondary w-full fixed top-0 right-0 z-50 py-3 lg:py-4 3xl:py-4.5 transition-500
        ${isScrolled ? 'shadow-primary' : ''}
        ${isHidden ? 'translate-y-[-80px]' : ''}`}
    >
      <div className="container flex items-center justify-between gap-2.5">
        <div className="inline-flex">
          <Link
            href="/"
            className="text-gradient font-nunito relative z-50 text-2xl md:text-[27px] 2xl:text-[29px] 3xl:text-[31px]"
          >
            Nz<i className="pl-[3px]">Coding</i>.
          </Link>
        </div>

        <ThemeToggleButton />

        {/* Mobile Nav Toggle */}
        <button
          className={`relative z-50 lg:hidden ${isNavActive ? 'rotate-[-45deg]' : 'rotate-[-55deg]'}`}
          onClick={() => setNavActive(!isNavActive)}
        >
          <span
            className={`block bg-gradient rounded-full ml-auto w-2.5 h-[3px] md:w-3 ${
              isNavActive ? 'my-0.5 rotate-90 translate-x-[-5px] md:my-[3px] md:translate-x-[-6px]' : 'my-1'
            }`}
          />
          <span className="block bg-gradient rounded-full w-5 h-[3px] md:w-6" />
          <span
            className={`block bg-gradient rounded-full w-2.5 h-[3px] md:w-3 ${
              isNavActive ? 'my-0.5 rotate-90 translate-x-[5px] md:my-[3px] md:translate-x-[6px]' : 'my-1'
            }`}
          />
        </button>

        {/* Nav Menu */}
        <nav
          className={`bg-secondary w-full h-full fixed left-0 grid place-items-center transition-all 
          duration-700 ${isDesktop ? '' : 'ease-[cubic-bezier(0.71,0.01,0.24,0.99)]'}
          lg:w-auto lg:static lg:h-auto lg:visible lg:duration-500 
          ${!isDesktop && !isNavActive ? 'top-full invisible delay-500' : 'top-0 visible'} z-40`}
        >
          <ul
            className="flex flex-col items-center lg:flex-row lg:gap-5 2xl:gap-8 3xl:gap-9"
            onClick={() => !isDesktop && setNavActive(false)}
          >
            {NAV_LINKS.map(({ name, path }) => (
              <li key={name} className="my-1 py-2.5 px-10 overflow-hidden sm:my-1.5 sm:py-3 lg:m-0 lg:p-0 rounded-lg">
                <Link
                  href={path}
                  className={`nav-links text-gradient font-bold font-nunito relative rounded-lg 
                    px-2 lg:px-1.5 text-2xl lg:text-[1.05rem] 2xl:text-[1.1rem] 3xl:text-[1.15rem]  
                    transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.27,2)] lg:duration-500 lg:translate-y-0 
                    ${!isDesktop && !isNavActive ? 'translate-y-12' : 'translate-y-0 delay-500'}
                    hover:before:w-full before:content-[""] before:w-0 before:h-[3px] before:absolute before:left-0 
                    before:top-1/2 before:-translate-y-1/2  before:rounded-full
                    ${pathname === path ? 'before:w-full' : 'before:w-0'}`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
