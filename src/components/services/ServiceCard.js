'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa6';

//
// ─── SINGLE SERVICE CARD UI ───────────────────────────────────────
//
export const ServiceCard = ({ service }) => {
  const pathname = usePathname();
  const isServicesPage = pathname === '/services';

  return (
    <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 hover:-translate-y-0.5 hover:scale-[1.015]">
      <div
        className={`content border-primary flex-col-center transition-300 p-2
        overflow-hidden rounded-xl hover:border-transparent w-full h-full z-10 group
        ${isServicesPage ? 'bg-primary-card' : 'bg-secondary-card'}`}
      >
        <div className="p-5 flex flex-col justify-between min-h-[280px]">
          <div>
            {/* Service Icon */}
            <div className="flex justify-between items-center">
              <div className="dual-color-icon aspect-square relative size-14 rounded-lg mb-4">
                <div
                  className="w-full h-full p-2 bg-gradient-to-br from-cyan-600 to-teal-500 dark:from-cyan-500 dark:to-teal-300 rounded-lg transition-all duration-300"
                  style={{
                    maskImage: `url(${service.icon})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${service.icon})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                />
              </div>

              <Link
                href={isServicesPage ? '/' : '/services'}
                className={`p-2 rounded-full mb-4 transition-300
                ${isServicesPage ? 'bg-primary' : 'bg-secondary'}`}
              >
                <FaArrowRight className="service-arrow size-7 text-teal-500 dark:text-teal-300" />
              </Link>
            </div>

            <h3 className="text-primary font-bold text-2xl mb-3">{service.title}</h3>
            <p>{service.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

//
// ─── SERVICE SKELETON CARD UI ──────────────────────────────────────
//
export const SkeletonServiceCard = () => {
  const pathname = usePathname();
  const isServicesPage = pathname === '/services';

  return (
    <div className="card-animation flex-center relative p-[3px] rounded-2xl overflow-hidden transition-300 animate-pulse hover:-translate-y-0.5 hover:scale-[1.015]">
      <div
        className={`content border-primary flex-col-center transition-300 p-2
          overflow-hidden rounded-xl w-full h-full z-10 group min-h-[280px]
          ${isServicesPage ? 'bg-primary-card' : 'bg-secondary-card'}`}
      >
        <div className="p-5 flex flex-col justify-between min-h-[280px] w-full">
          <div>
            {/* Top row: Icon + Arrow */}
            <div className="flex justify-between items-center mb-4">
              <div className="aspect-square size-14 rounded-lg skeleton-fields" />
              <div className="size-10 rounded-full skeleton-fields" />
            </div>

            {/* Title */}
            <div className="h-6 w-2/3 rounded mb-3 skeleton-fields" />

            {/* Description lines */}
            <div className="h-4 w-full rounded mb-2 skeleton-fields" />
            <div className="h-4 w-full rounded mb-2 skeleton-fields" />
            <div className="h-4 w-full rounded mb-2 skeleton-fields" />
            <div className="h-4 w-full rounded mb-2 skeleton-fields" />
            <div className="h-4 w-5/6 rounded skeleton-fields" />
          </div>
        </div>
      </div>
    </div>
  );
};
