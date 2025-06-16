import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { i18n } from '../translate/i18n';

const useApi = () => {
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (config, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      showSuccess = false,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      onFinally,
    } = options;

    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await api(config);

      if (showSuccess && successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      console.error('API Error:', error);

      // Manejar errores específicos
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            // Error de autenticación - ya manejado por el interceptor
            break;
          case 403:
            // Error de permisos
            if (showError) {
              toast.error(errorMessage || i18n.t('common.errors.forbidden'));
            }
            break;
          case 404:
            // Recurso no encontrado
            if (showError) {
              toast.error(errorMessage || i18n.t('common.errors.notFound'));
            }
            break;
          case 422:
            // Error de validación
            if (showError) {
              const message =
                data?.error ||
                errorMessage ||
                i18n.t('common.errors.validation');
              toast.error(message);
            }
            break;
          case 500:
            // Error del servidor
            if (showError) {
              toast.error(errorMessage || i18n.t('common.errors.server'));
            }
            break;
          default:
            // Otros errores
            if (showError) {
              const message =
                data?.error || errorMessage || i18n.t('common.errors.unknown');
              toast.error(message);
            }
        }
      } else if (error.request) {
        // Error de red
        if (showError) {
          toast.error(errorMessage || i18n.t('common.errors.network'));
        }
      } else {
        // Error de configuración
        if (showError) {
          toast.error(errorMessage || i18n.t('common.errors.config'));
        }
      }

      if (onError) {
        onError(error);
      }

      throw error;
    } finally {
      if (showLoading) {
        setLoading(false);
      }

      if (onFinally) {
        onFinally();
      }
    }
  }, []);

  const get = useCallback(
    (url, options = {}) => {
      return request({ method: 'GET', url }, options);
    },
    [request]
  );

  const post = useCallback(
    (url, data, options = {}) => {
      return request({ method: 'POST', url, data }, options);
    },
    [request]
  );

  const put = useCallback(
    (url, data, options = {}) => {
      return request({ method: 'PUT', url, data }, options);
    },
    [request]
  );

  const del = useCallback(
    (url, options = {}) => {
      return request({ method: 'DELETE', url }, options);
    },
    [request]
  );

  return {
    loading,
    request,
    get,
    post,
    put,
    delete: del,
  };
};

export default useApi;
