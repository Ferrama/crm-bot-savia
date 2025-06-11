import { useCallback, useEffect } from 'react';

const SaviaSessionManager = () => {
  // Función para preservar cookies y localStorage
  const preserveSession = useCallback(() => {
    try {
      // Guardar información de la sesión actual
      const sessionInfo = {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      };

      localStorage.setItem('saviaSessionInfo', JSON.stringify(sessionInfo));

      // Intentar preservar cookies específicas de Savia (simplificado)
      const saviaCookies = document.cookie
        .split(';')
        .filter(
          (cookie) =>
            cookie.trim().startsWith('savia') ||
            cookie.trim().startsWith('session') ||
            cookie.trim().startsWith('auth')
        );

      if (saviaCookies.length > 0) {
        localStorage.setItem(
          'saviaPreservedCookies',
          JSON.stringify(saviaCookies)
        );
        console.log('Savia cookies preserved:', saviaCookies.length);
      }
    } catch (error) {
      console.error('Error preserving Savia session:', error);
    }
  }, []);

  // Función para restaurar cookies y localStorage
  const restoreSession = useCallback(() => {
    try {
      const preservedCookies = localStorage.getItem('saviaPreservedCookies');
      if (preservedCookies) {
        const cookies = JSON.parse(preservedCookies);
        cookies.forEach((cookie) => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            document.cookie = `${name}=${value}; path=/; domain=.savia3.com.ar; secure; samesite=strict`;
          }
        });
        console.log('Savia cookies restored');
      }
    } catch (error) {
      console.error('Error restoring Savia session:', error);
    }
  }, []);

  useEffect(() => {
    // Preservar sesión al cargar
    preserveSession();

    // Restaurar sesión cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        restoreSession();
      }
    };

    // Escuchar cambios de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpiar listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [preserveSession, restoreSession]);

  return null; // Este componente no renderiza nada visible
};

export default SaviaSessionManager;
