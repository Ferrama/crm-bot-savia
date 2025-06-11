import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const SaviaIframeContext = createContext();

export const useSaviaIframe = () => {
  const context = useContext(SaviaIframeContext);
  if (!context) {
    throw new Error('useSaviaIframe must be used within a SaviaIframeProvider');
  }
  return context;
};

export const SaviaIframeProvider = ({ children }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  const iframeRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // Check if iframe was previously loaded
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const wasLoaded = localStorage.getItem('saviaIframeLoaded') === 'true';
      if (wasLoaded) {
        setIsIframeLoaded(true);
        console.log('Savia iframe was previously loaded');
      }
    }
  }, []);

  const initializeIframe = useCallback(() => {
    console.log('initializeIframe called');

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
    }

    if (iframeRef.current) {
      console.log('iframeRef.current exists:', iframeRef.current);
      console.log('iframe src:', iframeRef.current.src);
      console.log('iframe current styles:', {
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

      // Find the Savia page container to get its position and dimensions
      const saviaContainer = document.querySelector('[data-savia-container]');
      console.log('saviaContainer found:', !!saviaContainer);

      if (saviaContainer) {
        // Wait for container to be visible and have dimensions
        const waitForContainer = () => {
          const containerRect = saviaContainer.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(saviaContainer);

          console.log('Container check:', {
            width: containerRect.width,
            height: containerRect.height,
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
          });

          if (
            containerRect.width > 0 &&
            containerRect.height > 0 &&
            computedStyle.display !== 'none' &&
            computedStyle.visibility !== 'hidden' &&
            parseFloat(computedStyle.opacity) > 0
          ) {
            console.log(
              'Container is ready, proceeding with iframe positioning'
            );
            updateIframePosition();
          } else {
            console.log('Container not ready, retrying in 200ms...');
            setTimeout(waitForContainer, 200);
          }
        };

        const updateIframePosition = () => {
          const containerRect = saviaContainer.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;

          console.log('Container dimensions:', {
            top: containerRect.top,
            left: containerRect.left,
            width: containerRect.width,
            height: containerRect.height,
            scrollTop,
            scrollLeft,
          });

          // Ensure we have valid dimensions
          if (containerRect.width <= 0 || containerRect.height <= 0) {
            console.log(
              'Container has invalid dimensions, retrying in 100ms...'
            );
            // Retry after a short delay
            setTimeout(updateIframePosition, 100);
            return;
          }

          // Use the exact container coordinates without any adjustments
          const top = containerRect.top;
          const left = containerRect.left;
          const width = containerRect.width;
          const height = containerRect.height;

          // Prevent positioning with negative coordinates
          if (top < 0 || left < 0) {
            console.log('Preventing negative positioning:', { top, left });
            return;
          }

          // Check if the new position would be significantly different from current position
          const currentTop = parseFloat(iframeRef.current.style.top) || 0;
          const currentLeft = parseFloat(iframeRef.current.style.left) || 0;

          if (
            Math.abs(top - currentTop) < 5 &&
            Math.abs(left - currentLeft) < 5
          ) {
            // console.log('Position change too small, skipping update');
            return;
          }

          // Simplified positioning - just like the working iframe
          iframeRef.current.style.position = 'fixed';
          iframeRef.current.style.top = `${top}px`;
          iframeRef.current.style.left = `${left}px`;
          iframeRef.current.style.width = `${width}px`;
          iframeRef.current.style.height = `${height}px`;
          iframeRef.current.style.opacity = '1';
          iframeRef.current.style.pointerEvents = 'auto';
          iframeRef.current.style.zIndex = '1000';
          iframeRef.current.style.border = 'none';
          iframeRef.current.style.backgroundColor = 'white';
          iframeRef.current.style.visibility = 'visible';
          iframeRef.current.style.display = 'block';
          iframeRef.current.style.transform = 'none'; // Ensure no transforms are applied
          iframeRef.current.style.overflow = 'hidden'; // Prevent scrollbars

          console.log('Iframe styles applied:', {
            position: iframeRef.current.style.position,
            top: iframeRef.current.style.top,
            left: iframeRef.current.style.left,
            width: iframeRef.current.style.width,
            height: iframeRef.current.style.height,
            opacity: iframeRef.current.style.opacity,
            zIndex: iframeRef.current.style.zIndex,
            visibility: iframeRef.current.style.visibility,
            display: iframeRef.current.style.display,
            transform: iframeRef.current.style.transform,
            overflow: iframeRef.current.style.overflow,
          });
        };

        updateIframePosition();
        setIsIframeVisible(true);

        // Add listeners for resize and scroll with debugging
        const debouncedUpdatePosition = () => {
          // console.log('Resize/scroll event triggered, updating iframe position');
          updateIframePosition();
        };

        // Add a more specific scroll listener
        const handleScroll = () => {
          const rect = iframeRef.current.getBoundingClientRect();
          if (rect.top < 0 || rect.left < 0) {
            console.log(
              'Scroll caused iframe to move off-screen, correcting...'
            );
            updateIframePosition();
          }
        };

        window.addEventListener('resize', debouncedUpdatePosition);
        window.addEventListener('scroll', debouncedUpdatePosition);
        window.addEventListener('scroll', handleScroll);

        // Wait for DOM to be fully loaded before positioning
        const waitForDOM = () => {
          if (document.readyState === 'complete') {
            console.log('DOM fully loaded, positioning iframe...');
            updateIframePosition();
          } else {
            console.log('DOM not ready, waiting...');
            setTimeout(waitForDOM, 100);
          }
        };

        // Start waiting for DOM
        waitForDOM();

        // Start waiting for container
        waitForContainer();

        // Add a MutationObserver to detect DOM changes that might affect positioning
        const observer = new MutationObserver((mutations) => {
          let shouldUpdate = false;
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'childList' ||
              mutation.type === 'attributes'
            ) {
              // Check if the mutation affects the container or its parents
              const target = mutation.target;
              if (
                target === saviaContainer ||
                saviaContainer.contains(target) ||
                target.contains(saviaContainer)
              ) {
                // Only update if the mutation affects positioning-related attributes
                if (mutation.type === 'attributes') {
                  const attributeName = mutation.attributeName;
                  if (attributeName === 'style' || attributeName === 'class') {
                    shouldUpdate = true;
                  }
                } else {
                  // For childList changes, only update if it's significant
                  if (
                    mutation.addedNodes.length > 0 ||
                    mutation.removedNodes.length > 0
                  ) {
                    shouldUpdate = true;
                  }
                }
              }
            }
          });

          if (shouldUpdate) {
            // console.log('Significant DOM mutation detected, updating iframe position');
            // Debounce the update to avoid excessive calls
            clearTimeout(iframeRef.current._updateTimeout);
            iframeRef.current._updateTimeout = setTimeout(
              updateIframePosition,
              200
            );
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class'],
        });

        // Store the update function and observer for cleanup
        iframeRef.current._updatePosition = debouncedUpdatePosition;
        iframeRef.current._observer = observer;

        console.log('Savia iframe positioned over container - styles applied');

        // Check if iframe is actually visible
        setTimeout(() => {
          const rect = iframeRef.current.getBoundingClientRect();
          console.log('Iframe actual position after positioning:', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
          });

          // Check if iframe content is accessible
          try {
            if (iframeRef.current.contentDocument) {
              console.log('Iframe content document is accessible');
              console.log(
                'Iframe content URL:',
                iframeRef.current.contentDocument.URL
              );
              console.log(
                'Iframe content title:',
                iframeRef.current.contentDocument.title
              );

              // Check if there's any content in the iframe
              if (iframeRef.current.contentDocument.body) {
                const bodyContent =
                  iframeRef.current.contentDocument.body.innerHTML;
                console.log('Iframe body content length:', bodyContent.length);
                console.log(
                  'Iframe body content preview:',
                  bodyContent.substring(0, 500)
                );

                // Check if the iframe contains another iframe
                const nestedIframes =
                  iframeRef.current.contentDocument.querySelectorAll('iframe');
                console.log('Nested iframes found:', nestedIframes.length);

                if (nestedIframes.length > 0) {
                  nestedIframes.forEach((nestedIframe, index) => {
                    console.log(`Nested iframe ${index}:`, {
                      src: nestedIframe.src,
                      width: nestedIframe.width,
                      height: nestedIframe.height,
                      style: nestedIframe.style.cssText,
                    });
                  });
                }
              }
            } else {
              console.log(
                'Iframe content document not accessible (CORS restriction)'
              );
            }
          } catch (error) {
            console.log(
              'Cannot access iframe content (expected due to CORS):',
              error.message
            );
          }

          // Check if iframe is positioned off-screen and correct it
          if (rect.top < 0 || rect.left < 0) {
            console.log('Iframe moved off-screen, correcting position...');
            // Force immediate correction with valid coordinates
            const containerRect = saviaContainer.getBoundingClientRect();
            const finalTop = Math.max(
              0,
              Math.min(
                containerRect.top,
                window.innerHeight - containerRect.height
              )
            );
            const finalLeft = Math.max(
              0,
              Math.min(
                containerRect.left,
                window.innerWidth - containerRect.width
              )
            );

            iframeRef.current.style.top = `${finalTop}px`;
            iframeRef.current.style.left = `${finalLeft}px`;

            console.log('Forced iframe correction:', { finalTop, finalLeft });
            updateIframePosition();
          }

          // Check if iframe is visually present
          const iframeElement = iframeRef.current;
          if (iframeElement) {
            const computedStyle = window.getComputedStyle(iframeElement);
            console.log('Iframe computed styles:', {
              display: computedStyle.display,
              visibility: computedStyle.visibility,
              opacity: computedStyle.opacity,
              zIndex: computedStyle.zIndex,
              position: computedStyle.position,
            });

            // Check if iframe is actually visible to the user
            if (
              computedStyle.display === 'none' ||
              computedStyle.visibility === 'hidden' ||
              parseFloat(computedStyle.opacity) === 0
            ) {
              console.log('Iframe is not visually visible to the user');
            } else {
              console.log('Iframe should be visually visible to the user');
            }
          }
        }, 100);
      } else {
        console.log('Savia container not found');
      }
    } else {
      console.log('Cannot show iframe - ref not available');
    }
  }, []);

  const hideIframe = useCallback(() => {
    console.log('hideIframe called - stack trace:', new Error().stack);
    if (iframeRef.current) {
      // Remove listeners
      if (iframeRef.current._updatePosition) {
        window.removeEventListener('resize', iframeRef.current._updatePosition);
        window.removeEventListener('scroll', iframeRef.current._updatePosition);
        delete iframeRef.current._updatePosition;
      }

      // Disconnect observer
      if (iframeRef.current._observer) {
        iframeRef.current._observer.disconnect();
        delete iframeRef.current._observer;
      }

      // Clear any pending timeouts
      if (iframeRef.current._updateTimeout) {
        clearTimeout(iframeRef.current._updateTimeout);
        delete iframeRef.current._updateTimeout;
      }

      // Hide iframe by moving it off-screen
      iframeRef.current.style.position = 'fixed';
      iframeRef.current.style.top = '-9999px';
      iframeRef.current.style.left = '-9999px';
      iframeRef.current.style.width = '1px';
      iframeRef.current.style.height = '1px';
      iframeRef.current.style.opacity = '0';
      iframeRef.current.style.pointerEvents = 'none';
      iframeRef.current.style.zIndex = '-1';
      setIsIframeVisible(false);
      console.log('Savia iframe hidden');
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    console.log('handleIframeLoad called');
    if (!isIframeLoaded) {
      setIsIframeLoaded(true);
      localStorage.setItem('saviaIframeLoaded', 'true');
      localStorage.setItem('saviaIframeLoadTime', Date.now().toString());
      console.log('Savia iframe loaded successfully');

      // Try to access iframe content to verify it's working
      try {
        if (iframeRef.current && iframeRef.current.contentDocument) {
          console.log('Iframe content document accessible');
          console.log(
            'Iframe content URL:',
            iframeRef.current.contentDocument.URL
          );
          console.log(
            'Iframe content title:',
            iframeRef.current.contentDocument.title
          );
        } else {
          console.log(
            'Iframe content document not accessible (likely due to CORS)'
          );
        }
      } catch (error) {
        console.log(
          'Cannot access iframe content (expected due to CORS):',
          error.message
        );
      }

      // Check if iframe is visible and positioned correctly
      setTimeout(() => {
        if (iframeRef.current) {
          const rect = iframeRef.current.getBoundingClientRect();
          console.log('Iframe position after load:', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0,
          });

          // Check if iframe has content
          try {
            if (
              iframeRef.current.contentDocument &&
              iframeRef.current.contentDocument.body
            ) {
              const bodyContent =
                iframeRef.current.contentDocument.body.innerHTML;
              console.log('Iframe body content length:', bodyContent.length);
              console.log(
                'Iframe body content preview:',
                bodyContent.substring(0, 200)
              );
            }
          } catch (error) {
            console.log(
              'Cannot access iframe body content (CORS restriction):',
              error.message
            );
          }
        }
      }, 1000); // Increased delay to ensure content is loaded
    }
  }, [isIframeLoaded]);

  const handleIframeError = useCallback(() => {
    console.error('Error loading Savia iframe');
    setIsIframeLoaded(true); // Set to true to prevent infinite loading
  }, []);

  const reloadIframe = useCallback(() => {
    console.log('reloadIframe called - stack trace:', new Error().stack);
    if (iframeRef.current) {
      console.log('Reloading Savia iframe');
      setIsIframeLoaded(false);
      setIsIframeVisible(false);
      iframeRef.current.src = iframeRef.current.src;
      localStorage.removeItem('saviaIframeLoaded');
      localStorage.removeItem('saviaIframeLoadTime');
    }
  }, []);

  const sendMessageToIframe = useCallback((message) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        message,
        'https://www.savia3.com.ar/'
      );
    }
  }, []);

  const value = {
    isIframeLoaded,
    isIframeVisible,
    iframeRef,
    initializeIframe,
    hideIframe,
    handleIframeLoad,
    handleIframeError,
    reloadIframe,
    sendMessageToIframe,
  };

  return (
    <SaviaIframeContext.Provider value={value}>
      {children}
    </SaviaIframeContext.Provider>
  );
};
