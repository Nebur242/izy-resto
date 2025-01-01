import { Toaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toast() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Toaster
      position={isMobile ? "top-center" : "bottom-center"}
      toastOptions={{
        duration: 3000,
        className: '!top-safe-area toast-container',
        style: {
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          color: '#1f2937',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          margin: isMobile ? '12px' : '0',
        },
        success: {
          style: {
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#166534',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          },
          icon: <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0" />,
        },
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#991b1b',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          },
          icon: <XCircle className="text-red-600 w-6 h-6 flex-shrink-0" />,
        },
        loading: {
          style: {
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#1e40af',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          },
          icon: <Info className="text-blue-600 w-6 h-6 flex-shrink-0" />,
        },
        warning: {
          style: {
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#92400e',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          },
          icon: <AlertTriangle className="text-amber-600 w-6 h-6 flex-shrink-0" />,
        }
      }}
    />
  );
}