import React, { useCallback, useEffect } from 'react';
import { useSaviaIframe } from '../../context/SaviaIframe/SaviaIframeContext';

const SaviaIframePersistent = () => {
  const { iframeRef, handleIframeLoad, handleIframeError, reloadIframe } =
    useSaviaIframe();

  const handleIframeErrorCallback = useCallback(() => {
    console.error('Error loading Savia persistent iframe');
    handleIframeError();
  }, [handleIframeError]);

  const handleIframeLoadCallback = useCallback(() => {
    console.log('Savia iframe loaded successfully in persistent component');

    // Check if the iframe actually loaded content
    setTimeout(() => {
      if (iframeRef.current) {
        try {
          if (
            iframeRef.current.contentDocument &&
            iframeRef.current.contentDocument.body
          ) {
            const bodyContent =
              iframeRef.current.contentDocument.body.innerHTML;
            console.log(
              'Iframe loaded with content length:',
              bodyContent.length
            );

            if (bodyContent.length < 100) {
              console.log(
                'Iframe appears to be empty or blocked, trying alternative approach...'
              );
              // Try to reload with different parameters
              iframeRef.current.src = iframeRef.current.src + '?iframe=true';
            }
          }
        } catch (error) {
          console.log(
            'Cannot check iframe content (CORS restriction):',
            error.message
          );
        }
      }
    }, 2000);

    handleIframeLoad();
  }, [handleIframeLoad]);

  // Test if Savia website is accessible
  useEffect(() => {
    const testSaviaAccess = async () => {
      try {
        const response = await fetch('https://www.savia3.com.ar/', {
          method: 'HEAD',
          mode: 'no-cors', // This is necessary for cross-origin requests
        });
        console.log('Savia website accessibility test completed');
      } catch (error) {
        console.warn('Savia website accessibility test failed:', error);
      }
    };

    testSaviaAccess();
  }, []);

  // Debug iframe creation
  useEffect(() => {
    console.log('SaviaIframePersistent component mounted');
    console.log('iframeRef.current:', iframeRef.current);

    if (iframeRef.current) {
      console.log('Iframe element created with src:', iframeRef.current.src);
      console.log('Iframe initial styles:', {
        position: iframeRef.current.style.position,
        top: iframeRef.current.style.top,
        left: iframeRef.current.style.left,
        width: iframeRef.current.style.width,
        height: iframeRef.current.style.height,
        opacity: iframeRef.current.style.opacity,
        zIndex: iframeRef.current.style.zIndex,
        visibility: iframeRef.current.style.visibility,
        display: iframeRef.current.style.display,
      });
    }
  }, [iframeRef]);

  // Verificar la salud del iframe periódicamente (menos frecuente)
  useEffect(() => {
    const healthCheck = setInterval(() => {
      // Simple health check - if iframe exists and has src
      if (iframeRef.current && iframeRef.current.src) {
        console.log('Savia iframe health check passed');
      } else {
        console.log('Savia iframe health check failed, reloading...');
        reloadIframe();
      }
    }, 10 * 60 * 1000); // Verificar cada 10 minutos

    return () => clearInterval(healthCheck);
  }, [iframeRef, reloadIframe]);

  return (
    <div
      data-savia-persistent
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <iframe
        ref={iframeRef}
        src='https://www.savia3.com.ar/'
        title='Savia Website (Persistent)'
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          transition: 'none',
          backgroundColor: 'white',
        }}
        onLoad={handleIframeLoadCallback}
        onError={handleIframeErrorCallback}
        sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-top-navigation-by-user-activation allow-presentation'
        allow='fullscreen; camera; microphone; geolocation; display-capture'
        loading='eager'
        importance='high'
        referrerPolicy='no-referrer'
        scrolling='no'
      />
    </div>
  );
};

export default SaviaIframePersistent;
