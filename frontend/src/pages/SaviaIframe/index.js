import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import Title from '../../components/Title';
import { useSaviaIframe } from '../../context/SaviaIframe/SaviaIframeContext';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: 'calc(100vh - 120px)',
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
    transform: 'translateZ(0)',
    border: '2px solid red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: '18px',
    color: theme.palette.primary.main,
  },
}));

function SaviaIframe() {
  const classes = useStyles();
  const {
    isIframeLoaded,
    isIframeVisible,
    iframeRef,
    initializeIframe,
    hideIframe,
    reloadIframe,
  } = useSaviaIframe();
  const [isLoading, setIsLoading] = useState(true);

  // Función para forzar recarga si es necesario
  const handleForceReload = useCallback(() => {
    setIsLoading(true);
    reloadIframe();
    setTimeout(() => {
      setIsLoading(false);
      initializeIframe();
    }, 3000);
  }, [reloadIframe, initializeIframe]);

  useEffect(() => {
    console.log('Savia page accessed');
    console.log('isIframeLoaded:', isIframeLoaded);
    console.log('isIframeVisible:', isIframeVisible);

    if (isIframeLoaded) {
      // Si el iframe ya está cargado, mostrarlo inmediatamente
      console.log('Iframe is already loaded, showing immediately');
      setTimeout(() => {
        initializeIframe();
        setIsLoading(false);
        console.log('Showing persistent iframe');
      }, 100);
    } else {
      // Si no está cargado, esperar a que se cargue
      console.log('Iframe not loaded yet, waiting...');
      const timer = setTimeout(() => {
        console.log('Timeout reached, initializing iframe anyway');
        setIsLoading(false);
        initializeIframe();
        console.log('Initializing iframe after timeout');
      }, 3000); // Increased timeout to 3 seconds

      return () => clearTimeout(timer);
    }

    // Don't hide iframe on cleanup - we want it to persist
    // return () => {
    //   hideIframe();
    // };
  }, [isIframeLoaded, isIframeVisible, initializeIframe]);

  // Add a fallback effect to ensure iframe is shown
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Fallback: forcing iframe initialization');
        setIsLoading(false);
        initializeIframe();
      }
    }, 8000); // Increased fallback to 8 seconds

    return () => clearTimeout(fallbackTimer);
  }, [isLoading, initializeIframe]);

  // Check if iframe content is loading correctly
  useEffect(() => {
    if (!isLoading && isIframeLoaded) {
      const contentCheckTimer = setTimeout(() => {
        // Check if iframe has meaningful content
        const iframeElement = document.querySelector(
          'iframe[src*="savia3.com.ar"]'
        );
        if (iframeElement) {
          try {
            if (
              iframeElement.contentDocument &&
              iframeElement.contentDocument.body
            ) {
              const bodyContent = iframeElement.contentDocument.body.innerHTML;
              if (bodyContent.length < 100) {
                console.log('Iframe content seems empty, forcing reload...');
                handleForceReload();
              }
            }
          } catch (error) {
            console.log('Cannot check iframe content (CORS restriction)');
          }
        }
      }, 5000); // Check after 5 seconds

      return () => clearTimeout(contentCheckTimer);
    }
  }, [isLoading, isIframeLoaded, handleForceReload]);

  return (
    <MainContainer>
      <MainHeader>
        <Title>Savia</Title>
      </MainHeader>
      <div className={classes.container} data-savia-container>
        {isLoading && (
          <div className={classes.loadingOverlay}>
            <div className={classes.loadingText}>
              {isIframeLoaded ? 'Cargando Savia...' : 'Inicializando Savia...'}
            </div>
          </div>
        )}

        {/* Contenedor para el iframe persistente */}
        {!isLoading && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          >
            <iframe
              src='https://www.savia3.com.ar/'
              style={{ width: '100%', height: '100%' }}
            ></iframe>
          </div>
        )}
      </div>
    </MainContainer>
  );
}

export default SaviaIframe;
