import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { Badge, Collapse, List } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { isArray } from 'lodash';
import { Can } from '../components/Can';
import { AuthContext } from '../context/Auth/AuthContext';
import { SocketContext } from '../context/Socket/SocketContext';
import { WhatsAppsContext } from '../context/WhatsApp/WhatsAppsContext';
import toastError from '../errors/toastError';
import { loadJSON } from '../helpers/loadJSON';
import api from '../services/api';
import { i18n } from '../translate/i18n';

import {
  Album,
  Bell,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Code,
  MessageSquare as Forum,
  HelpCircle,
  Layers,
  LayoutDashboard,
  List as LucideList,
  MessageSquare,
  Settings,
  Tag,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';

const gitinfo = loadJSON('/gitinfo.json');

const useStyles = makeStyles((theme) => ({
  ListSubheader: {
    height: 26,
    marginTop: '-15px',
    marginBottom: '-10px',
  },
  whatsappIcon: {
    fontSize: '24px',
    width: '24px',
    height: '24px',
  },
  smallBadge: {
    '& .MuiBadge-badge': {
      height: '12px',
      minWidth: '12px',
      padding: '0 4px',
      fontSize: '0.65rem',
      borderRadius: '6px',
    },
  },
}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button dense component={renderLink} className={className}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const reducer = (state, action) => {
  if (action.type === 'LOAD_CHATS') {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === 'UPDATE_CHATS') {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === 'DELETE_CHAT') {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === 'RESET') {
    return [];
  }

  if (action.type === 'CHANGE_CHAT') {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerClose, drawerOpen } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user, handleLogout } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(true);
  const [openKanbanSubmenu, setOpenKanbanSubmenu] = useState(false);

  const [showCampaigns, setShowCampaigns] = useState(false);
  const history = useHistory();
  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState('');
  const [chats, dispatch] = useReducer(reducer, []);
  const [version, setVersion] = useState('v N/A');

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    const socket = socketManager.GetSocket(companyId);

    const onCompanyChatMainListItems = (data) => {
      if (data.action === 'new-message') {
        dispatch({ type: 'CHANGE_CHAT', payload: data });
      }
      if (data.action === 'update') {
        dispatch({ type: 'CHANGE_CHAT', payload: data });
      }
    };

    socket.on(`company-${companyId}-chat`, onCompanyChatMainListItems);
    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);
  useEffect(() => {
    if (localStorage.getItem('cshow')) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === 'qrcode' ||
            whats.status === 'PAIRING' ||
            whats.status === 'DISCONNECTED' ||
            whats.status === 'TIMEOUT' ||
            whats.status === 'OPENING'
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get('/chats/', {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: 'LOAD_CHATS', payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickLogout = () => {
    //handleCloseMenu();
    handleLogout();
  };

  return (
    <div onClick={drawerClose}>
      <Can
        role={user.profile}
        perform={'drawer-service-items:view'}
        style={{
          overflowY: 'scroll',
        }}
        no={() => (
          <>
            <ListSubheader
              hidden={!drawerOpen}
              style={{
                position: 'relative',
                fontSize: '17px',
                textAlign: 'left',
                paddingLeft: 20,
              }}
              inset
              color='inherit'
            >
              {i18n.t('mainDrawer.listItems.service')}
            </ListSubheader>
            <>
              <ListItemLink
                to='/tickets'
                primary={i18n.t('mainDrawer.listItems.tickets')}
                icon={<MessageSquare />}
              />
              <ListItemLink
                to='/todolist'
                primary={i18n.t('mainDrawer.listItems.todoList')}
                icon={<CheckSquare />}
              />
              <ListItemLink
                to='/quick-messages'
                primary={i18n.t('mainDrawer.listItems.quickMessages')}
                icon={<Zap />}
              />
              <ListItemLink
                to='/contacts'
                primary={i18n.t('mainDrawer.listItems.contacts')}
                icon={<User />}
              />
              <ListItemLink
                to='/schedules'
                primary={i18n.t('mainDrawer.listItems.schedules')}
                icon={<Calendar />}
              />
              <ListItemLink
                to='/tags'
                primary={i18n.t('mainDrawer.listItems.tags')}
                icon={<Tag />}
              />
              <ListItemLink
                to='/chats'
                primary={i18n.t('mainDrawer.listItems.chats')}
                icon={
                  <Badge color='secondary' variant='dot' invisible={invisible}>
                    <Forum />
                  </Badge>
                }
              />
              <ListItemLink
                to='/helps'
                primary={i18n.t('mainDrawer.listItems.helps')}
                icon={<HelpCircle />}
              />
              <ListItemLink
                to='/leads'
                primary={i18n.t('mainDrawer.listItems.leads')}
                icon={<TrendingUp />}
              />
              <ListItemLink
                to='/savia'
                primary={i18n.t('mainDrawer.listItems.savia')}
                icon={<Album />}
              />
            </>
          </>
        )}
      />

      <Can
        role={user.profile}
        perform={'drawer-admin-items:view'}
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={!drawerOpen}
              style={{
                position: 'relative',
                fontSize: '17px',
                textAlign: 'left',
                paddingLeft: 20,
              }}
              inset
              color='inherit'
            >
              {i18n.t('mainDrawer.listItems.management')}
            </ListSubheader>
            <ListItemLink
              small
              to='/'
              primary={i18n.t('mainDrawer.listItems.dashboard')}
              icon={<LayoutDashboard />}
            />
          </>
        )}
      />
      <Can
        role={user.profile}
        perform='drawer-admin-items:view'
        yes={() => (
          <>
            <Divider />
            <ListSubheader
              hidden={!drawerOpen}
              style={{
                position: 'relative',
                fontSize: '17px',
                textAlign: 'left',
                paddingLeft: 20,
              }}
              inset
              color='inherit'
            >
              {i18n.t('mainDrawer.listItems.administration')}
            </ListSubheader>

            {
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <Calendar />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t('mainDrawer.listItems.campaigns')}
                  />
                  {openCampaignSubmenu ? <ChevronUp /> : <ChevronDown />}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout='auto'
                  unmountOnExit
                >
                  <List component='div' disablePadding>
                    <ListItem onClick={() => history.push('/campaigns')} button>
                      <ListItemIcon>
                        <LucideList />
                      </ListItemIcon>
                      <ListItemText
                        primary={i18n.t('mainDrawer.listItems.listing')}
                      />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push('/contact-lists')}
                      button
                    >
                      <ListItemIcon>
                        <Users />
                      </ListItemIcon>
                      <ListItemText
                        primary={i18n.t('mainDrawer.listItems.contactLists')}
                      />
                    </ListItem>
                    <ListItem
                      onClick={() => history.push('/campaigns-config')}
                      button
                    >
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>
                      <ListItemText
                        primary={i18n.t('mainDrawer.listItems.configurations')}
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            }
            {user.super && (
              <ListItemLink
                to='/announcements'
                primary={i18n.t('mainDrawer.listItems.annoucements')}
                icon={<Bell />}
              />
            )}
            <ListItemLink
              to='/connections'
              primary={i18n.t('mainDrawer.listItems.connections')}
              icon={
                <Badge
                  size='small'
                  badgeContent={connectionWarning ? '!' : 0}
                  color='error'
                  className={classes.smallBadge}
                >
                  <WhatsAppIcon className={classes.whatsappIcon} />
                </Badge>
              }
            />
            <ListItemLink
              to='/queues'
              primary={i18n.t('mainDrawer.listItems.queues')}
              icon={<Layers />}
            />
            <ListItemLink
              to='/users'
              primary={i18n.t('mainDrawer.listItems.users')}
              icon={<Users />}
            />
            <ListItemLink
              to='/messages-api'
              primary={i18n.t('mainDrawer.listItems.messagesAPI')}
              icon={<Code />}
            />
            {/* <ListItemLink
              to='/financeiro'
              primary={i18n.t('mainDrawer.listItems.financeiro')}
              icon={<Wallet />}
            /> */}

            <ListItemLink
              to='/settings'
              primary={i18n.t('mainDrawer.listItems.settings')}
              icon={<Settings />}
            />
          </>
        )}
      />
      <Divider />
    </div>
  );
};

export default MainListItems;
