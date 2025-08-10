'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';

const DEVICE_SIZES = {
  mobile: { maxWidth: 375 },
  tablet: { maxWidth: 768 },
  laptop: { maxWidth: 1024 },
  desktop: { maxWidth: 1440 },
};

const ALL_DEVICES = [
  { key: 'mobile', icon: <Smartphone size={20} />, device: 'mobile' },
  { key: 'tablet', icon: <Tablet size={20} />, device: 'tablet' },
  { key: 'laptop', icon: <Laptop size={20} />, device: 'laptop' },
  { key: 'desktop', icon: <Monitor size={20} />, device: 'desktop' },
];

const DEVICE_ORDER = ['mobile', 'tablet', 'laptop', 'desktop'];

const DEVICE_ICONS = DEVICE_ORDER.reduce((acc, curr, index) => {
  acc[curr] = curr === 'mobile' ? [] : ALL_DEVICES.slice(0, index + 1);
  return acc;
}, {});

// Utility: Get viewport/device label from width
const getDeviceFromWidth = (width) => {
  if (width < DEVICE_SIZES.tablet.maxWidth) return 'mobile';
  if (width < DEVICE_SIZES.laptop.maxWidth) return 'tablet';
  if (width < DEVICE_SIZES.desktop.maxWidth) return 'laptop';
  return 'desktop';
};

export function LivePreviewModal({ open, onClose, url }) {
  const [isLoading, setIsLoading] = useState(true);
  const [device, setDevice] = useState(() =>
    typeof window !== 'undefined' ? getDeviceFromWidth(window.innerWidth) : 'desktop'
  );
  const [currentViewport, setCurrentViewport] = useState(() =>
    typeof window !== 'undefined' ? getDeviceFromWidth(window.innerWidth) : 'desktop'
  );

  // Sync device + currentViewport with window width
  useEffect(() => {
    const updateViewport = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const detectedDevice = getDeviceFromWidth(width);
      setCurrentViewport(detectedDevice);
      setDevice(detectedDevice); // Sync the preview device
    };

    updateViewport(); // Run on mount
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setIsLoading(true);
  }, [url, open]);

  if (!open) return null;

  const currentSize = DEVICE_SIZES[device];
  const availableIcons = DEVICE_ICONS[currentViewport] || [];

  const getModalWidth = () => {
    if (typeof window === 'undefined') return 800;
    return Math.min(currentSize.maxWidth, window.innerWidth);
  };

  const modalWidth = getModalWidth();

  return (
    <div
      className="fixed inset-0 flex-center bg-primary p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col min-h-full rounded-xl shadow-2xl overflow-hidden"
        style={{ width: `${modalWidth}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-secondary">
          <button onClick={onClose} className="btn-secondary flex-center gap-2 px-3 py-2 text-sm ">
            <ArrowLeft size={18} />
            {device !== 'mobile' && <span>Back</span>}
          </button>

          {/* Device Size Toggles */}
          <div className="flex items-center gap-2 rounded-lg p-1">
            {availableIcons.map((iconData) => (
              <button
                key={iconData.key}
                onClick={() => setDevice(iconData.device)}
                title={`${iconData.device} (${DEVICE_SIZES[iconData.device].maxWidth}px)`}
                className={`p-2 rounded-md ${device === iconData.device ? 'btn-primary shadow-sm' : 'btn-secondary'}`}
              >
                {iconData.icon}
              </button>
            ))}
          </div>

          <div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-center gap-2 px-3 py-2 text-sm cursor-pointer"
            >
              {device !== 'mobile' && <span>Visit Site</span>}
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 flex-center">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 z-10 flex-center">
              <div className="text-center">
                <div className="animate-spin rounded-full size-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Loading preview...</p>
              </div>
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              maxWidth: currentSize.maxWidth ? `${Math.min(currentSize.maxWidth, modalWidth)}px` : `${modalWidth}px`,
            }}
          >
            <iframe
              src={url}
              title="Live Preview"
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LivePreviewTrigger({ url }) {
  const [open, setOpen] = useState(false);

  const isValidUrl = url && typeof url === 'string' && url.trim().startsWith('http');

  if (!isValidUrl) {
    console.warn('LivePreviewTrigger: URL is empty or invalid:', url);
    return null;
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex-center space-x-2 btn-primary" type="button">
        <ExternalLink size={14} strokeWidth={3} />
        <span>Live Demo</span>
      </button>

      <LivePreviewModal open={open} onClose={() => setOpen(false)} url={url} />
    </>
  );
}
