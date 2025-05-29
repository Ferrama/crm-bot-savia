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
            fontWeight: 500,
            body1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            body2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h3: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h4: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h5: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            h6: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            button: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            subtitle1: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            subtitle2: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            overline: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
            },
            caption: {
              fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
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
          overrides: {
            MuiButton: {
              root: {
                textTransform: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '8px 16px',
                minHeight: '40px',
                transition: 'all 0.2s ease-in-out',
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
                },
                '&.Mui-disabled': {
                  pointerEvents: 'none',
                  opacity: 0.5,
                  cursor: 'not-allowed',
                },
              },
              contained: {
                backgroundColor:
                  mode === 'light' ? primaryColorLight : primaryColorDark,
                color: '#fff',
                '&:hover': {
                  backgroundColor:
                    mode === 'light'
                      ? `${primaryColorLight}E6` // 90% opacity
                      : `${primaryColorDark}E6`,
                },
                '&.Mui-disabled': {
                  backgroundColor: mode === 'light' ? '#E0E0E0' : '#42484E',
                },
              },
              outlined: {
                border: `1px solid ${mode === 'light' ? '#E5E7EB' : '#696E7B'}`,
                backgroundColor: mode === 'light' ? '#fff' : '#3A4249',
                color: mode === 'light' ? '#111827' : '#F3F4F6',
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#42484E',
                },
                '&.Mui-disabled': {
                  borderColor: mode === 'light' ? '#E5E7EB' : '#696E7B',
                },
              },
              text: {
                color: mode === 'light' ? primaryColorLight : primaryColorDark,
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#42484E',
                },
                '&.Mui-disabled': {
                  color: mode === 'light' ? '#9CA3AF' : '#6B7280',
                },
              },
              sizeSmall: {
                minHeight: '36px',
                padding: '6px 12px',
                fontSize: '0.875rem',
              },
              sizeLarge: {
                minHeight: '44px',
                padding: '8px 32px',
                fontSize: '1rem',
              },
              startIcon: {
                marginRight: '8px',
                '& > *:first-child': {
                  fontSize: '1.25rem',
                },
              },
              endIcon: {
                marginLeft: '8px',
                '& > *:first-child': {
                  fontSize: '1.25rem',
                },
              },
            },
            MuiButtonBase: {
              root: {
                '&.MuiButton-contained.MuiButton-colorPrimary': {
                  backgroundColor:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor:
                      mode === 'light'
                        ? `${primaryColorLight}E6`
                        : `${primaryColorDark}E6`,
                  },
                },
                '&.MuiButton-contained.MuiButton-colorSecondary': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#3A4249',
                  color: mode === 'light' ? '#111827' : '#F3F4F6',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#E5E7EB' : '#42484E',
                  },
                },
                '&.MuiButton-contained.MuiButton-colorError': {
                  backgroundColor: mode === 'light' ? '#DC2626' : '#EF4444',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#B91C1C' : '#DC2626',
                  },
                },
              },
            },
            MuiInputLabel: {
              root: {
                display: 'block !important',
                position: 'static !important',
                transform: 'none !important',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                marginBottom: '4px',
                '&.Mui-focused': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                },
                '&.Mui-error': {
                  color: mode === 'light' ? '#DC2626' : '#EF4444',
                },
                '&.Mui-disabled': {
                  color: mode === 'light' ? '#9CA3AF' : '#6B7280',
                },
                '&.MuiInputLabel-shrink': {
                  transform: 'none !important',
                },
                '&.MuiInputLabel-formControl': {
                  transform: 'none !important',
                  top: '0',
                  left: '0',
                  position: 'static !important',
                },
                '&.MuiInputLabel-animated': {
                  transition: 'none !important',
                },
              },
            },
            MuiFormLabel: {
              root: {
                display: 'block !important',
                position: 'static !important',
                transform: 'none !important',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                marginBottom: '4px',
                '&.Mui-focused': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                },
                '&.Mui-error': {
                  color: mode === 'light' ? '#DC2626' : '#EF4444',
                },
                '&.Mui-disabled': {
                  color: mode === 'light' ? '#9CA3AF' : '#6B7280',
                },
                '&.MuiInputLabel-shrink': {
                  transform: 'none !important',
                },
                '&.MuiInputLabel-formControl': {
                  transform: 'none !important',
                  top: '0',
                  left: '0',
                  position: 'static !important',
                },
                '&.MuiInputLabel-animated': {
                  transition: 'none !important',
                },
              },
            },
            MuiOutlinedInput: {
              root: {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                padding: '8px 12px',
                marginTop: '0',
                '& .MuiInputLabel-root': {
                  transform: 'none !important',
                },
              },
              input: {
                padding: '0',
              },
            },
            MuiInputBase: {
              root: {
                '&.MuiInputBase-root': {
                  backgroundColor: mode === 'light' ? '#fff' : '#3A4249',
                  border: `1px solid ${
                    mode === 'light' ? '#E5E7EB' : '#696E7B'
                  }`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  padding: '8px 12px',
                  transition: 'all 0.2s ease-in-out',
                  marginTop: '0',
                  '& .MuiInputLabel-root': {
                    transform: 'none !important',
                  },
                  '&:hover': {
                    borderColor: mode === 'light' ? '#D1D5DB' : '#7B7F8A',
                  },
                  '&.Mui-focused': {
                    borderColor:
                      mode === 'light' ? primaryColorLight : primaryColorDark,
                    boxShadow: `0 0 0 1px ${
                      mode === 'light' ? primaryColorLight : primaryColorDark
                    }`,
                    outline: 'none',
                  },
                  '&.Mui-error': {
                    borderColor: mode === 'light' ? '#DC2626' : '#EF4444',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 1px ${
                        mode === 'light' ? '#DC2626' : '#EF4444'
                      }`,
                    },
                  },
                  '&.Mui-disabled': {
                    backgroundColor: mode === 'light' ? '#F3F4F6' : '#2E353B',
                    borderColor: mode === 'light' ? '#E5E7EB' : '#696E7B',
                    color: mode === 'light' ? '#9CA3AF' : '#6B7280',
                  },
                },
              },
              input: {
                '&::placeholder': {
                  color: mode === 'light' ? '#9CA3AF' : '#6B7280',
                  opacity: 1,
                },
                color: mode === 'light' ? '#111827' : '#F3F4F6',
                '&.Mui-disabled': {
                  WebkitTextFillColor: mode === 'light' ? '#9CA3AF' : '#6B7280',
                },
              },
            },
            MuiFormHelperText: {
              root: {
                marginLeft: '4px',
                marginTop: '4px',
                fontSize: '0.75rem',
                '&.Mui-error': {
                  color: mode === 'light' ? '#DC2626' : '#EF4444',
                },
              },
            },
            MuiDialog: {
              root: {
                '& .MuiDialog-paper': {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '8px',
                  maxWidth: '32rem',
                  width: '100%',
                  maxHeight: '90vh',
                  margin: 0,
                  backgroundColor: mode === 'light' ? '#fff' : '#42484e',
                  border: `1px solid ${
                    mode === 'light' ? '#E5E7EB' : '#696E7B'
                  }`,
                  boxShadow:
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 200ms ease-out',
                  opacity: 0,
                  transform: 'translate(-50%, -48%) scale(0.95)',
                  '&.MuiDialog-paperScrollPaper': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1)',
                  },
                },
                '& .MuiDialog-container': {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
            },
            MuiDialogTitle: {
              root: {
                padding: '24px 24px 16px',
                fontSize: '1.125rem',
                fontWeight: 500,
                color: mode === 'light' ? '#111827' : '#F3F4F6',
                lineHeight: '1.5',
                letterSpacing: '-0.025em',
                '&.MuiTypography-root': {
                  margin: 0,
                },
              },
            },
            MuiDialogContent: {
              root: {
                padding: '16px 24px',
                color: mode === 'light' ? '#374151' : '#D1D5DB',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                '&.MuiDialogContent-root': {
                  paddingTop: '16px',
                },
              },
            },
            MuiDialogActions: {
              root: {
                padding: '16px 24px 24px',
                gap: '8px',
                justifyContent: 'flex-end',
                '& > :not(:first-of-type)': {
                  marginLeft: '8px',
                },
              },
            },
            MuiDialogContentText: {
              root: {
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                marginBottom: '16px',
              },
            },
            MuiBackdrop: {
              root: {
                backgroundColor:
                  mode === 'light'
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                transition: 'opacity 200ms ease-out',
                opacity: 0,
                '&.MuiBackdrop-invisible': {
                  opacity: 1,
                },
              },
            },
            MuiTabs: {
              root: {
                minHeight: '40px',
                backgroundColor: mode === 'light' ? '#F3F4F6' : '#3A4249',
                borderRadius: '6px',
                padding: '4px',
                border: `1px solid ${mode === 'light' ? '#E5E7EB' : '#696E7B'}`,
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
                '& .MuiTabs-flexContainer': {
                  gap: '4px',
                },
              },
              scroller: {
                overflow: 'hidden',
              },
            },
            MuiTab: {
              root: {
                minHeight: '32px',
                padding: '6px 12px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' ? '#FFFFFF' : '#2E353B',
                  color: mode === 'light' ? '#111827' : '#F3F4F6',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#E5E7EB' : '#42484E',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  pointerEvents: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `0 0 0 2px ${
                    mode === 'light' ? primaryColorLight : primaryColorDark
                  }`,
                },
              },
            },
            MuiTabPanel: {
              root: {
                padding: '16px 0',
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `0 0 0 2px ${
                    mode === 'light' ? primaryColorLight : primaryColorDark
                  }`,
                },
              },
            },
            MuiTableContainer: {
              root: {
                position: 'relative',
                width: '100%',
                overflow: 'auto',
                borderRadius: '8px',
                border: `1px solid ${mode === 'light' ? '#E5E7EB' : '#696E7B'}`,
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#2E353B',
              },
            },
            MuiTable: {
              root: {
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                fontSize: '0.875rem',
              },
            },
            MuiTableHead: {
              root: {
                '& .MuiTableCell-head': {
                  backgroundColor: mode === 'light' ? '#F9FAFB' : '#3A4249',
                  color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  padding: '16px',
                  borderBottom: `1px solid ${
                    mode === 'light' ? '#E5E7EB' : '#696E7B'
                  }`,
                  '&:first-child': {
                    paddingLeft: '24px',
                  },
                  '&:last-child': {
                    paddingRight: '24px',
                  },
                },
              },
            },
            MuiTableBody: {
              root: {
                '& .MuiTableRow-root': {
                  '&:last-child .MuiTableCell-root': {
                    borderBottom: 'none',
                  },
                },
              },
            },
            MuiTableRow: {
              root: {
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor:
                    mode === 'light'
                      ? 'rgba(243, 244, 246, 0.7)'
                      : 'rgba(58, 66, 73, 0.7)',
                },
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#3A4249',
                  '&:hover': {
                    backgroundColor:
                      mode === 'light'
                        ? 'rgba(243, 244, 246, 0.9)'
                        : 'rgba(58, 66, 73, 0.9)',
                  },
                },
              },
            },
            MuiTableCell: {
              root: {
                padding: '16px',
                fontSize: '0.875rem',
                color: mode === 'light' ? '#374151' : '#D1D5DB',
                borderBottom: `1px solid ${
                  mode === 'light' ? '#E5E7EB' : '#696E7B'
                }`,
                '&:first-child': {
                  paddingLeft: '24px',
                },
                '&:last-child': {
                  paddingRight: '24px',
                },
              },
              body: {
                color: mode === 'light' ? '#374151' : '#D1D5DB',
              },
              footer: {
                borderTop: `1px solid ${
                  mode === 'light' ? '#E5E7EB' : '#696E7B'
                }`,
                backgroundColor:
                  mode === 'light'
                    ? 'rgba(243, 244, 246, 0.5)'
                    : 'rgba(58, 66, 73, 0.5)',
                fontWeight: 500,
                '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                  borderBottom: 'none',
                },
              },
            },
            MuiTablePagination: {
              root: {
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                fontSize: '0.875rem',
                borderTop: `1px solid ${
                  mode === 'light' ? '#E5E7EB' : '#696E7B'
                }`,
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#2E353B',
              },
              toolbar: {
                minHeight: '52px',
                padding: '0 16px',
              },
              select: {
                paddingRight: '32px',
              },
              selectIcon: {
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
              },
              input: {
                color: mode === 'light' ? '#374151' : '#D1D5DB',
              },
            },
            MuiTableSortLabel: {
              root: {
                '&:hover': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                },
                '&.MuiTableSortLabel-active': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                  '& .MuiTableSortLabel-icon': {
                    color:
                      mode === 'light' ? primaryColorLight : primaryColorDark,
                  },
                },
              },
              icon: {
                color: mode === 'light' ? '#9CA3AF' : '#6B7280',
              },
            },
            MuiMenu: {
              paper: {
                minWidth: '8rem',
                borderRadius: '6px',
                border: `1px solid ${mode === 'light' ? '#E5E7EB' : '#696E7B'}`,
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#2E353B',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '4px',
                marginTop: '4px',
                transition: 'all 200ms ease-out',
                opacity: 0,
                transform: 'scale(0.95) translateY(-8px)',
                '&.MuiMenu-paper': {
                  opacity: 1,
                  transform: 'scale(1) translateY(0)',
                },
              },
              list: {
                padding: '4px',
              },
            },
            MuiMenuItem: {
              root: {
                minHeight: '36px',
                padding: '6px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                color: mode === 'light' ? '#374151' : '#D1D5DB',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#3A4249',
                },
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' ? '#F3F4F6' : '#3A4249',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#E5E7EB' : '#42484E',
                  },
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  pointerEvents: 'none',
                },
                '& .MuiListItemIcon-root': {
                  minWidth: '32px',
                  color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                },
                '& .MuiListItemText-root': {
                  margin: 0,
                },
                '& .MuiListItemSecondaryAction-root': {
                  right: '8px',
                },
              },
            },
            MuiListSubheader: {
              root: {
                fontSize: '0.875rem',
                fontWeight: 600,
                color: mode === 'light' ? '#111827' : '#F3F4F6',
                padding: '6px 8px',
                lineHeight: '1.5',
                backgroundColor: 'transparent',
              },
            },
            MuiDivider: {
              root: {
                margin: '4px -4px',
                backgroundColor: mode === 'light' ? '#E5E7EB' : '#696E7B',
              },
            },
            MuiCheckbox: {
              root: {
                padding: '4px',
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                '&.Mui-checked': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                },
              },
            },
            MuiRadio: {
              root: {
                padding: '4px',
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                '&.Mui-checked': {
                  color:
                    mode === 'light' ? primaryColorLight : primaryColorDark,
                },
              },
            },
            MuiListItemIcon: {
              root: {
                minWidth: '32px',
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
              },
            },
            MuiListItemText: {
              primary: {
                fontSize: '0.875rem',
                color: mode === 'light' ? '#374151' : '#D1D5DB',
              },
              secondary: {
                fontSize: '0.75rem',
                color: mode === 'light' ? '#6B7280' : '#9CA3AF',
                opacity: 0.6,
                letterSpacing: '0.05em',
              },
            },
            MuiTooltip: {
              tooltip: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#3A4249',
                color: mode === 'light' ? '#111827' : '#F3F4F6',
                fontSize: '0.875rem',
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${mode === 'light' ? '#E5E7EB' : '#696E7B'}`,
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxWidth: '20rem',
                zIndex: 1500,
                transition:
                  'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&[data-popper-placement*="bottom"]': {
                  marginTop: '4px',
                  transform: 'translateY(4px)',
                  '&[data-popper-placement*="bottom"].MuiTooltip-popperEntered':
                    {
                      transform: 'translateY(0)',
                    },
                },
                '&[data-popper-placement*="top"]': {
                  marginBottom: '4px',
                  transform: 'translateY(-4px)',
                  '&[data-popper-placement*="top"].MuiTooltip-popperEntered': {
                    transform: 'translateY(0)',
                  },
                },
                '&[data-popper-placement*="left"]': {
                  marginRight: '4px',
                  transform: 'translateX(-4px)',
                  '&[data-popper-placement*="left"].MuiTooltip-popperEntered': {
                    transform: 'translateX(0)',
                  },
                },
                '&[data-popper-placement*="right"]': {
                  marginLeft: '4px',
                  transform: 'translateX(4px)',
                  '&[data-popper-placement*="right"].MuiTooltip-popperEntered':
                    {
                      transform: 'translateX(0)',
                    },
                },
                opacity: 0,
                '&.MuiTooltip-popperEntered': {
                  opacity: 1,
                },
              },
              arrow: {
                color: mode === 'light' ? '#FFFFFF' : '#3A4249',
                '&::before': {
                  border: `1px solid ${
                    mode === 'light' ? '#E5E7EB' : '#696E7B'
                  }`,
                },
              },
              popper: {
                '&[data-popper-placement*="bottom"] .MuiTooltip-arrow': {
                  top: 0,
                  marginTop: '-0.71em',
                },
                '&[data-popper-placement*="top"] .MuiTooltip-arrow': {
                  bottom: 0,
                  marginBottom: '-0.71em',
                },
                '&[data-popper-placement*="left"] .MuiTooltip-arrow': {
                  right: 0,
                  marginRight: '-0.71em',
                },
                '&[data-popper-placement*="right"] .MuiTooltip-arrow': {
                  left: 0,
                  marginLeft: '-0.71em',
                },
              },
            },
          },
          props: {
            MuiButton: {
              disableElevation: true,
              disableRipple: true,
              disableFocusRipple: true,
              disableTouchRipple: true,
            },
            MuiButtonBase: {
              disableRipple: true,
              disableFocusRipple: true,
              disableTouchRipple: true,
            },
            MuiTab: {
              disableRipple: true,
              disableFocusRipple: true,
              disableTouchRipple: true,
            },
            MuiIconButton: {
              disableRipple: true,
              disableFocusRipple: true,
              disableTouchRipple: true,
            },
            MuiListItem: {
              disableRipple: true,
              disableFocusRipple: true,
              disableTouchRipple: true,
            },
            MuiTextField: {
              variant: 'outlined',
              size: 'small',
            },
            MuiInputBase: {
              disableUnderline: true,
            },
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
