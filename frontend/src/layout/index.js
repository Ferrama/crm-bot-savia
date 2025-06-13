import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';

import { ChevronLeft, User } from 'lucide-react';

import AboutModal from '../components/AboutModal';
import AnnouncementsPopover from '../components/AnnouncementsPopover';
import BackdropLoading from '../components/BackdropLoading';
import { Backendlogs } from '../components/Backendlogs';
import NotificationsPopOver from '../components/NotificationsPopOver';
import NotificationsVolume from '../components/NotificationsVolume';
import UserModal from '../components/UserModal';
import { AuthContext } from '../context/Auth/AuthContext';
import toastError from '../errors/toastError';
import { i18n } from '../translate/i18n';
import { messages } from '../translate/languages';
import MainListItems from './MainListItems';

import { SocketContext } from '../context/Socket/SocketContext';
import ChatPopover from '../pages/Chat/ChatPopover';

import useAuth from '../hooks/useAuth.js';
import { useDate } from '../hooks/useDate';

import NestedMenuItem from 'material-ui-nested-menu-item';
import GoogleAnalytics from '../components/GoogleAnalytics';
import OnlyForSuperUser from '../components/OnlyForSuperUser';

import SaviaSessionManager from '../components/SaviaSessionManager';
import ColorModeContext from '../layout/themeContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: theme.palette.fancyBackground,
    '& .MuiButton-outlinedPrimary': {
      color: theme.palette.primary,
      border:
        theme.mode === 'light'
          ? '1px solid rgba(0 124 102)'
          : '1px solid rgba(255, 255, 255, 0.5)',
    },
    '& .MuiTab-textColorPrimary.Mui-selected': {
      color: theme.palette.primary,
    },
  },
  avatar: {
    width: '100%',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    color:
      localStorage.getItem('impersonated') === 'true'
        ? theme.palette.secondary.contrastText
        : theme.palette.primary.contrastText,
    background:
      localStorage.getItem('impersonated') === 'true'
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '48px',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    fontSize: 14,
    color: 'white',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowY: 'clip',
    ...theme.scrollbarStylesSoft,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    overflowY: 'clip',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
    minHeight: '48px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  containerWithScroll: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: 'auto',
    overflowX: 'clip',
    ...theme.scrollbarStyles,
  },
  NotificationsPopOver: {
    // color: theme.barraSuperior.secondary.main,
  },
  logo: {
    maxWidth: '192px',
    maxHeight: '72px',
    logo: theme.logo,
    margin: 'auto',
    content: `url("${theme.calculatedLogo()}")`,
  },
  hideLogo: {
    display: 'none',
  },
}));

const LoggedInLayout = ({ children, themeToggle }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState('permanent');
  // const [dueDate, setDueDate] = useState("");
  const { user } = useContext(AuthContext);

  const theme = useTheme();
  const { colorMode } = useContext(ColorModeContext);
  const greaterThenSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const { getCurrentUserInfo } = useAuth();
  const [currentUser, setCurrentUser] = useState({});

  const [volume, setVolume] = useState(localStorage.getItem('volume') || 1);

  const { dateToClient } = useDate();

  const socketManager = useContext(SocketContext);

  //################### CODIGOS DE TESTE #########################################
  // useEffect(() => {
  //   navigator.getBattery().then((battery) => {
  //     console.log(`Battery Charging: ${battery.charging}`);
  //     console.log(`Battery Level: ${battery.level * 100}%`);
  //     console.log(`Charging Time: ${battery.chargingTime}`);
  //     console.log(`Discharging Time: ${battery.dischargingTime}`);
  //   })
  // }, []);

  // useEffect(() => {
  //   const geoLocation = navigator.geolocation

  //   geoLocation.getCurrentPosition((position) => {
  //     let lat = position.coords.latitude;
  //     let long = position.coords.longitude;

  //     console.log('latitude: ', lat)
  //     console.log('longitude: ', long)
  //   })
  // }, []);

  // useEffect(() => {
  //   const nucleos = window.navigator.hardwareConcurrency;

  //   console.log('Nucleos: ', nucleos)
  // }, []);

  // useEffect(() => {
  //   console.log('userAgent', navigator.userAgent)
  //   if (
  //     navigator.userAgent.match(/Android/i)
  //     || navigator.userAgent.match(/webOS/i)
  //     || navigator.userAgent.match(/iPhone/i)
  //     || navigator.userAgent.match(/iPad/i)
  //     || navigator.userAgent.match(/iPod/i)
  //     || navigator.userAgent.match(/BlackBerry/i)
  //     || navigator.userAgent.match(/Windows Phone/i)
  //   ) {
  //     console.log('é mobile ', true) //celular
  //   }
  //   else {
  //     console.log('não é mobile: ', false) //nao é celular
  //   }
  // }, []);
  //##############################################################################

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    getCurrentUserInfo().then((user) => {
      setCurrentUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant('temporary');
    } else {
      setDrawerVariant('permanent');
    }
  }, [drawerOpen]);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    const userId = localStorage.getItem('userId');

    const socket = socketManager.GetSocket(companyId);

    const onCompanyAuthLayout = (data) => {
      const impersonated = localStorage.getItem('impersonated') === 'true';
      if (
        !impersonated &&
        !data.user.impersonated &&
        data.user.id === +userId
      ) {
        toastError('Sua conta foi acessada em outro computador.');
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    };

    socket.on(`company-${companyId}-auth`, onCompanyAuthLayout);

    socket.emit('userStatus');
    const interval = setInterval(() => {
      socket.emit('userStatus');
    }, 1000 * 60 * 5);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [socketManager]);

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setLanguageOpen(true);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorEl(null);
    setLanguageOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseProfileMenu();
  };

  const handleOpenAboutModal = () => {
    setAboutModalOpen(true);
    handleCloseProfileMenu();
  };

  const handleClickLogout = () => {
    handleCloseProfileMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };

  const handleMenuItemClick = () => {
    const { innerWidth: width } = window;
    if (width <= 600) {
      setDrawerOpen(false);
    }
  };

  const toggleColorMode = () => {
    colorMode.toggleColorMode();
  };

  const handleChooseLanguage = (language) => {
    localStorage.setItem('language', language);
    window.location.reload(false);
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}>
      <Drawer
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <img
            className={drawerOpen ? classes.logo : classes.hideLogo}
            alt='logo'
          />
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.containerWithScroll}>
          <MainListItems
            drawerClose={drawerClose}
            drawerOpen={drawerOpen}
            collapsed={!drawerOpen}
          />
        </List>
        <Divider />
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AboutModal
        open={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        color='primary'
      >
        <Toolbar variant='dense' className={classes.toolbar}>
          <IconButton
            edge='start'
            variant='contained'
            aria-label='open drawer'
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(
              classes.menuButton,
              drawerOpen && classes.menuButtonHidden
            )}
          >
            <Menu />
          </IconButton>

          <Typography
            component='h2'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            {greaterThenSm &&
            user?.profile === 'admin' &&
            user?.company?.dueDate ? (
              <>
                {i18n.t('settings.WelcomeGreeting.greetings')}{' '}
                <b>{user.name}</b>, {i18n.t('settings.WelcomeGreeting.welcome')}{' '}
                <b>{user?.company?.name}</b>! (
                {i18n.t('settings.WelcomeGreeting.expirationTime')}{' '}
                {dateToClient(user?.company?.dueDate)})
              </>
            ) : (
              <>
                {i18n.t('settings.WelcomeGreeting.greetings')}{' '}
                <b>{user.name}</b>, {i18n.t('settings.WelcomeGreeting.welcome')}{' '}
                <b>{user?.company?.name}</b>! (
                {i18n.t('settings.WelcomeGreeting.expirationTime')}{' '}
                {dateToClient(user?.company?.dueDate)})
              </>
            )}
          </Typography>

          <OnlyForSuperUser user={currentUser} yes={() => <Backendlogs />} />

          <NotificationsVolume setVolume={setVolume} volume={volume} />

          {user.id && <NotificationsPopOver volume={volume} />}

          <AnnouncementsPopover />

          <ChatPopover />

          <div>
            <Menu
              id='language-appbar'
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={languageOpen}
              onClose={handleCloseLanguageMenu}
            >
              {Object.keys(messages).map((m) => (
                <MenuItem key={m} onClick={() => handleChooseLanguage(m)}>
                  {messages[m].translations.mainDrawer.appBar.i18n.language}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleProfileMenu}
              variant='contained'
              style={{ color: 'white' }}
            >
              <User />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={menuOpen}
              onClose={handleCloseProfileMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t('mainDrawer.appBar.user.profile')}
              </MenuItem>
              <MenuItem onClick={toggleColorMode}>
                {theme.mode === 'dark'
                  ? i18n.t('mainDrawer.appBar.user.lightmode')
                  : i18n.t('mainDrawer.appBar.user.darkmode')}
              </MenuItem>
              <NestedMenuItem
                label={i18n.t('mainDrawer.appBar.user.language')}
                parentMenuOpen={menuOpen}
              >
                {Object.keys(messages).map((m) => (
                  <MenuItem key={m} onClick={() => handleChooseLanguage(m)}>
                    {messages[m].translations.mainDrawer.appBar.i18n.language}
                  </MenuItem>
                ))}
              </NestedMenuItem>
              <MenuItem onClick={handleOpenAboutModal}>
                {i18n.t('about.aboutthe')}{' '}
                {currentUser?.super ? 'ticketz' : theme.appName}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t('mainDrawer.appBar.user.logout')}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <OnlyForSuperUser user={currentUser} yes={() => <GoogleAnalytics />} />
        {children ? children : null}
      </main>

      <SaviaSessionManager />
    </div>
  );
};

export default LoggedInLayout;
