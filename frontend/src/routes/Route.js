import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Route as RouterRoute } from 'react-router-dom';

import BackdropLoading from '../components/BackdropLoading';
import { AuthContext } from '../context/Auth/AuthContext';

const Route = ({ component: Component, isPrivate = false, ...rest }) => {
  const { isAuth, loading, user } = useContext(AuthContext);
  const [isInitializing, setIsInitializing] = useState(true);

  // Esperar a que la autenticación se inicialice completamente
  useEffect(() => {
    if (!loading) {
      setIsInitializing(false);
    }
  }, [loading]);

  // Si aún se está inicializando, mostrar loading
  if (isInitializing) {
    return <BackdropLoading />;
  }

  // Si la ruta es privada y el usuario no está autenticado
  if (!isAuth && isPrivate) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {
            from: rest.location,
            message: 'Por favor, inicia sesión para acceder a esta página.',
          },
        }}
      />
    );
  }

  // Si el usuario está autenticado y trata de acceder a login/signup
  if (
    isAuth &&
    !isPrivate &&
    (rest.path === '/login' || rest.path === '/signup')
  ) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: rest.location },
        }}
      />
    );
  }

  // Si hay loading pero ya se inicializó, mostrar loading
  if (loading) {
    return <BackdropLoading />;
  }

  return <RouterRoute {...rest} component={Component} />;
};

export default Route;
