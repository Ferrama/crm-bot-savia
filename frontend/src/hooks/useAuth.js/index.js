import { has, isArray } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';

import moment from 'moment';
import { decodeToken } from 'react-jwt';
import { SocketContext } from '../../context/Socket/SocketContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useAuth = () => {
  const history = useHistory();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const socketManager = useContext(SocketContext);

  // Función para verificar si el token es válido
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const decoded = decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('companyId');
    localStorage.removeItem('userId');
    localStorage.removeItem('cshow');
    localStorage.removeItem('companyDueDate');
    localStorage.removeItem('impersonated');
    api.defaults.headers.Authorization = undefined;
    setIsAuth(false);
    setUser({});
  };

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parsedToken = JSON.parse(token);
          if (isTokenValid(parsedToken)) {
            config.headers['Authorization'] = `Bearer ${parsedToken}`;
            setIsAuth(true);
          } else {
            // Token expirado, limpiar datos
            clearAuthData();
            throw new Error('Token expired');
          }
        } catch (error) {
          // Token inválido, limpiar datos
          clearAuthData();
          throw new Error('Invalid token');
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Si es un error 401 y no hemos intentado refrescar el token
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await api.post('/auth/refresh_token');
          if (data && data.token) {
            localStorage.setItem('token', JSON.stringify(data.token));
            api.defaults.headers.Authorization = `Bearer ${data.token}`;
            setIsAuth(true);
            setUser(data.user);
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Si el refresh token también falla, limpiar todo
          clearAuthData();
          if (history.location.pathname !== '/login') {
            history.push('/login');
            toast.error(i18n.t('auth.toasts.sessionExpired'));
          }
          return Promise.reject(refreshError);
        }
      }

      // Si es un error 403, intentar refrescar el token
      if (error?.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await api.post('/auth/refresh_token');
          if (data && data.token) {
            localStorage.setItem('token', JSON.stringify(data.token));
            api.defaults.headers.Authorization = `Bearer ${data.token}`;
            setIsAuth(true);
            setUser(data.user);
            return api(originalRequest);
          }
        } catch (refreshError) {
          clearAuthData();
          if (history.location.pathname !== '/login') {
            history.push('/login');
            toast.error(i18n.t('auth.toasts.sessionExpired'));
          }
          return Promise.reject(refreshError);
        }
      }

      // Para otros errores de autenticación
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        clearAuthData();
        if (history.location.pathname !== '/login') {
          history.push('/login');
          toast.error(i18n.t('auth.toasts.sessionExpired'));
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      if (token) {
        try {
          // Verificar si el token es válido antes de hacer la petición
          const parsedToken = JSON.parse(token);
          if (!isTokenValid(parsedToken)) {
            clearAuthData();
            setLoading(false);
            return;
          }

          const { data } = await api.post('/auth/refresh_token');
          if (data && data.token) {
            api.defaults.headers.Authorization = `Bearer ${data.token}`;
            setIsAuth(true);
            setUser(data.user);
          } else {
            clearAuthData();
          }
        } catch (err) {
          console.error('Auth error:', err);
          clearAuthData();
          toastError(err);
        }
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId || !isAuth) {
      return () => {};
    }

    const socket = socketManager.GetSocket(companyId);

    const onCompanyUserUseAuth = (data) => {
      if (data.action === 'update' && data.user.id === user.id) {
        setUser(data.user);
      }
    };

    socket.on(`company-${companyId}-user`, onCompanyUserUseAuth);

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuth]);

  const posLogin = (data, impersonated = false) => {
    const {
      user: { company },
      token,
    } = data;

    const { companyId, userId } = decodeToken(token);

    if (has(company, 'settings') && isArray(company.settings)) {
      const setting = company.settings.find(
        (s) => s.key === 'campaignsEnabled'
      );
      if (setting && setting.value === 'true') {
        localStorage.setItem('cshow', null); //regra pra exibir campanhas
      }
    }

    moment.locale('pt-br');
    const dueDate = data.user.company.dueDate;
    const hoje = moment(moment()).format('DD/MM/yyyy');
    const vencimento = moment(dueDate).format('DD/MM/yyyy');

    var diff = moment(dueDate).diff(moment(moment()).format());

    var dias = moment.duration(diff).asDays();

    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('companyId', companyId);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('companyDueDate', vencimento);
    localStorage.setItem('impersonated', impersonated);
    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
    setIsAuth(true);

    if (dias < 0) {
      toast.warn(
        `Sua assinatura venceu há ${Math.round(dias) * -1} ${
          Math.round(dias) * -1 === 1 ? 'dia' : 'dias'
        } `
      );
    } else if (Math.round(dias) < 5) {
      toast.warn(
        `Sua assinatura vence em ${Math.round(dias)} ${
          Math.round(dias) === 1 ? 'dia' : 'dias'
        } `
      );
    } else {
      toast.success(i18n.t('auth.toasts.success'));
    }

    if (data.user.profile === 'admin' && !data.user.hideAdminUI) {
      history.push('/');
    } else {
      history.push('/tickets');
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', userData);
      posLogin(data);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleImpersonate = async (companyId) => {
    setLoading(true);

    try {
      const { data } = await api.get(`/auth/impersonate/${companyId}`);
      posLogin(data, true);
      setLoading(false);
      window.location.reload(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await api.delete('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthData();
      setLoading(false);
      history.push('/login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (error) {
      console.error('Get user info error:', error);
      return null;
    }
  };

  return {
    isAuth,
    user,
    loading,
    handleLogin,
    handleImpersonate,
    handleLogout,
    getCurrentUserInfo,
    clearAuthData,
  };
};

export default useAuth;
