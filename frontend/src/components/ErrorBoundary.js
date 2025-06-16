import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Home, Refresh } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(3),
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
  },
  errorIcon: {
    fontSize: 64,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  errorTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
  },
  errorMessage: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
    maxWidth: 600,
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  errorDetails: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    fontSize: '12px',
    textAlign: 'left',
    maxWidth: '100%',
    overflow: 'auto',
    maxHeight: 200,
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          showDetails={this.state.showDetails}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          onToggleDetails={this.toggleDetails}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({
  error,
  errorInfo,
  showDetails,
  onRetry,
  onGoHome,
  onToggleDetails,
}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box className={classes.errorContainer}>
      <Typography variant='h1' className={classes.errorIcon}>
        ⚠️
      </Typography>

      <Typography variant='h4' className={classes.errorTitle}>
        Algo salió mal
      </Typography>

      <Typography variant='body1' className={classes.errorMessage}>
        Ha ocurrido un error inesperado. No te preocupes, nuestro equipo ha sido
        notificado. Puedes intentar recargar la página o volver al inicio.
      </Typography>

      <Box className={classes.buttonContainer}>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          Recargar página
        </Button>

        <Button
          variant='outlined'
          color='primary'
          startIcon={<Home />}
          onClick={onGoHome}
        >
          Ir al inicio
        </Button>

        {error && (
          <Button variant='text' color='secondary' onClick={onToggleDetails}>
            {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          </Button>
        )}
      </Box>

      {showDetails && error && (
        <Box className={classes.errorDetails}>
          <Typography variant='h6' gutterBottom>
            Detalles del error:
          </Typography>
          <Typography variant='body2' component='pre'>
            {error.toString()}
          </Typography>
          {errorInfo && (
            <>
              <Typography variant='h6' gutterBottom style={{ marginTop: 16 }}>
                Stack trace:
              </Typography>
              <Typography variant='body2' component='pre'>
                {errorInfo.componentStack}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ErrorBoundary;
