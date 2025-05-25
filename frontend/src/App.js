import React, { useEffect, useMemo, useState } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';

import { ptBR } from '@material-ui/core/locale';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Favicon from 'react-favicon';
import { SocketContext, socketManager } from './context/Socket/SocketContext';
import useSettings from './hooks/useSettings';
import ColorModeContext from './layout/themeContext';
import { getBackendURL } from './services/config';

import Routes from './routes';

const queryClient = new QueryClient();
const defaultLogoLight = '/vector/logo.svg';
const defaultLogoDark = '/vector/logo-dark.svg';
const defaultLogoFavicon = '/vector/favicon.svg';

const App = () => {
  const [locale, setLocale] = useState();

  const prefersDarkMode = !!window.matchMedia('(prefers-color-scheme: dark)')
    .matches;
  const preferredTheme = window.localStorage.getItem('preferredTheme');
  const [mode, setMode] = useState(
    preferredTheme ? preferredTheme : prefersDarkMode ? 'dark' : 'light'
  );
  const [primaryColorLight, setPrimaryColorLight] = useState('#888');
  const [primaryColorDark, setPrimaryColorDark] = useState('#888');
  const [appLogoLight, setAppLogoLight] = useState('');
  const [appLogoDark, setAppLogoDark] = useState('');
  const [appLogoFavicon, setAppLogoFavicon] = useState('');
  const [appName, setAppName] = useState('');
  const { getPublicSetting } = useSettings();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      setPrimaryColorLight: (color) => {
        setPrimaryColorLight(color);
      },
      setPrimaryColorDark: (color) => {
        setPrimaryColorDark(color);
      },
      setAppLogoLight: (file) => {
        setAppLogoLight(file);
      },
      setAppLogoDark: (file) => {
        setAppLogoDark(file);
      },
      setAppLogoFavicon: (file) => {
        setAppLogoFavicon(file);
      },
      setAppName: (name) => {
        setAppName(name);
      },
    }),
    []
  );

  const calculatedLogoDark = () => {
    if (appLogoDark === defaultLogoDark && appLogoLight !== defaultLogoLight) {
      return appLogoLight;
    }
    return appLogoDark;
  };
  const calculatedLogoLight = () => {
    if (appLogoDark !== defaultLogoDark && appLogoLight === defaultLogoLight) {
      return appLogoDark;
    }
    return appLogoLight;
  };

  const theme = useMemo(
    () =>
      createTheme(
        {
          typography: {
            fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            body1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            body2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h3: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h4: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h5: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            h6: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            button: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            subtitle1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            subtitle2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            overline: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
            caption: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
            },
          },
          scrollbarStyles: {
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
              backgroundColor:
                mode === 'light' ? primaryColorLight : primaryColorDark,
            },
          },
          scrollbarStylesSoft: {
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#F3F3F3' : '#333333',
            },
          },
          palette: {
            type: mode,
            primary: {
              main: mode === 'light' ? primaryColorLight : primaryColorDark,
            },
            textPrimary:
              mode === 'light' ? primaryColorLight : primaryColorDark,
            textCommon: mode === 'light' ? '#000' : '#fff',
            borderPrimary:
              mode === 'light' ? primaryColorLight : primaryColorDark,
            background: {
              default: mode === 'light' ? '#fafafa' : '#1a1d21',
              paper: mode === 'light' ? '#fff' : '#2e353b',
            },
            backgroundContrast: {
              default: mode === 'light' ? '#ddd' : '#3a4249',
              paper: mode === 'light' ? '#ddd' : '#3a4249',
              border: mode === 'light' ? '#aaa' : '#696e7b',
            },
            dark: { main: mode === 'light' ? '#333333' : '#696e7b' },
            light: { main: mode === 'light' ? '#F3F3F3' : '#2e353b' },
            tabHeaderBackground: mode === 'light' ? '#EEE' : '#3a4249',
            optionsBackground: mode === 'light' ? '#fafafa' : '#2e353b',
            options: mode === 'light' ? '#fafafa' : '#3a4249',
            fontecor: mode === 'light' ? primaryColorLight : primaryColorDark,
            fancyBackground: mode === 'light' ? '#fafafa' : '#2e353b',
            bordabox: mode === 'light' ? '#eee' : '#3a4249',
            newmessagebox: mode === 'light' ? '#eee' : '#3a4249',
            inputdigita: mode === 'light' ? '#fff' : '#2e353b',
            contactdrawer: mode === 'light' ? '#fff' : '#2e353b',
            announcements: mode === 'light' ? '#ededed' : '#2e353b',
            login: mode === 'light' ? '#fff' : '#1a1d21',
            announcementspopover: mode === 'light' ? '#fff' : '#3a4249',
            chatlist: mode === 'light' ? '#eee' : '#3a4249',
            boxlist: mode === 'light' ? '#ededed' : '#3a4249',
            boxchatlist: mode === 'light' ? '#ededed' : '#2e353b',
            total: mode === 'light' ? '#fff' : '#1a1d21',
            messageIcons: mode === 'light' ? 'grey' : '#F3F3F3',
            inputBackground: mode === 'light' ? '#FFFFFF' : '#2e353b',
            barraSuperior: mode === 'light' ? primaryColorLight : '#3a4249',
            boxticket: mode === 'light' ? '#EEE' : '#3a4249',
            campaigntab: mode === 'light' ? '#ededed' : '#3a4249',
            ticketzproad: { main: '#39ACE7', contrastText: 'white' },
          },
          mode,
          appLogoLight,
          appLogoDark,
          appLogoFavicon,
          appName,
          calculatedLogoLight,
          calculatedLogoDark,
          calculatedLogo: () => {
            if (mode === 'light') {
              return calculatedLogoLight();
            }
            return calculatedLogoDark();
          },
        },
        locale
      ),
    [
      appLogoLight,
      appLogoDark,
      appLogoFavicon,
      appName,
      locale,
      mode,
      primaryColorDark,
      primaryColorLight,
    ]
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem('language');
    if (!i18nlocale) {
      return;
    }

    const browserLocale =
      i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

    if (browserLocale === 'ptBR') {
      setLocale(ptBR);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('preferredTheme', mode);
  }, [mode]);

  useEffect(() => {
    getPublicSetting('primaryColorLight')
      .then((color) => {
        setPrimaryColorLight(color || '#0000FF');
      })
      .catch((error) => {
        console.log('Error reading setting', error);
      });
    getPublicSetting('primaryColorDark')
      .then((color) => {
        setPrimaryColorDark(color || '#39ACE7');
      })
      .catch((error) => {
        console.log('Error reading setting', error);
      });
    getPublicSetting('appLogoLight')
      .then(
        (file) => {
          setAppLogoLight(
            file ? `${getBackendURL()}/public/${file}` : defaultLogoLight
          );
        },
        (_) => {}
      )
      .catch((error) => {
        console.log('Error reading setting', error);
      });
    getPublicSetting('appLogoDark')
      .then((file) => {
        setAppLogoDark(
          file ? `${getBackendURL()}/public/${file}` : defaultLogoDark
        );
      })
      .catch((error) => {
        console.log('Error reading setting', error);
      });
    getPublicSetting('appLogoFavicon')
      .then((file) => {
        setAppLogoFavicon(file ? `${getBackendURL()}/public/${file}` : null);
      })
      .catch((error) => {
        console.log('Error reading setting', error);
      });
    getPublicSetting('appName')
      .then((name) => {
        setAppName(name || 'ticketz');
      })
      .catch((error) => {
        console.log('Error reading setting', error);
        setAppName('whitelabel chat');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Favicon
        url={appLogoFavicon ? theme.appLogoFavicon : defaultLogoFavicon}
      />
      <ColorModeContext.Provider value={{ colorMode }}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <SocketContext.Provider value={socketManager}>
              <Routes />
            </SocketContext.Provider>
          </QueryClientProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
