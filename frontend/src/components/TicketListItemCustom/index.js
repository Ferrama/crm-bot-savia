import React, { useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { format, isSameDay, parseISO } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import { blue, green, grey, red } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { i18n } from '../../translate/i18n';

import { Tooltip } from '@material-ui/core';
import WhatsMarked from 'react-whatsmarked';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../context/Auth/AuthContext';
import { TicketsContext } from '../../context/Tickets/TicketsContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';

import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { Check, Eye, MessageSquare, Smartphone, X } from 'lucide-react';
import { generateColor } from '../../helpers/colorGenerator';
import { getInitials } from '../../helpers/getInitials';
import TagsLine from '../TagsLine';
import TicketMessagesDialog from '../TicketMessagesDialog';

const useStyles = makeStyles((theme) => ({
  ticket: {
    position: 'relative',
    height: 98,
    paddingHorizontal: 10,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  pendingTicket: {
    cursor: 'unset',
  },

  noTicketsDiv: {
    display: 'flex',
    height: '100px',
    margin: 40,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noTicketsText: {
    textAlign: 'center',
    color: 'rgb(104, 121, 146)',
    fontSize: '14px',
    lineHeight: '1.4',
  },

  noTicketsTitle: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0px',
  },

  contactNameWrapper: {
    display: 'grid',
    justifyContent: 'space-between',
  },

  lastMessageTime: {
    justifySelf: 'flex-end',
    textAlign: 'right',
    position: 'relative',
    top: -23,
    fontSize: 12,
  },

  closedBadge: {
    alignSelf: 'center',
    justifySelf: 'flex-end',
    marginRight: 32,
    marginLeft: 'auto',
  },

  contactLastMessage: {},

  newMessagesCount: {
    alignSelf: 'center',
    marginRight: 0,
    marginLeft: 'auto',
    top: -10,
    right: 10,
  },

  badgeStyle: {
    color: 'white',
    backgroundColor: green[500],
    right: 0,
    top: 10,
  },

  acceptButton: {
    position: 'absolute',
    right: '108px',
  },

  ticketQueueColor: {
    flex: 'none',
    width: '8px',
    height: '100%',
    position: 'absolute',
    top: '0%',
    left: '0%',
  },

  ticketInfo: {
    position: 'relative',
    top: 0,
  },

  ticketInfo1: {
    position: 'relative',
    top: 40,
    right: 0,
  },
  Radiusdot: {
    '& .MuiBadge-badge': {
      borderRadius: 2,
      position: 'inherit',
      height: 16,
      margin: 2,
      padding: 3,
      fontSize: 10,
    },
    '& .MuiBadge-anchorOriginTopRightRectangle': {
      transform: 'scale(1) translate(0%, -40%)',
    },
  },
  presence: {
    color: theme.mode === 'light' ? 'green' : 'lightgreen',
    fontWeight: 'bold',
  },
  actionIcon: {
    color: '#fff',
    backgroundColor: red[700],
    cursor: 'pointer',
    padding: 2,
    height: 23,
    width: 23,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
    top: -8,
  },
}));

const TicketListItemCustom = ({ ticket, setTabOpen, groupActionButtons }) => {
  const classes = useStyles();
  const history = useHistory();
  const [ticketUser, setTicketUser] = useState(null);
  const [whatsAppName, setWhatsAppName] = useState(null);

  const [openTicketMessageDialog, setOpenTicketMessageDialog] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { setCurrentTicket } = useContext(TicketsContext);
  const { user } = useContext(AuthContext);
  const { profile } = user;

  useEffect(() => {
    if (ticket.userId && ticket.user) {
      setTicketUser(ticket.user.name);
    }

    if (ticket.whatsappId && ticket.whatsapp) {
      setWhatsAppName(ticket.whatsapp.name);
    }

    return () => {
      isMounted.current = false;
    };
  }, [ticket]);

  const handleCloseTicket = async (id) => {
    try {
      await api.put(`/tickets/${id}`, {
        status: 'closed',
        justClose: true,
        userId: user?.id,
      });
    } catch (err) {
      toastError(err);
    }
    history.push(`/tickets/`);
  };

  const handleAcceptTicket = async (id) => {
    try {
      await api.put(`/tickets/${id}`, {
        status: 'open',
        userId: user?.id,
      });
    } catch (err) {
      toastError(err);
    }

    history.push(`/tickets/${ticket.uuid}`);
    setTabOpen('open');
  };

  const handleSelectTicket = (ticket) => {
    const code = uuidv4();
    const { id, uuid } = ticket;
    setCurrentTicket({ id, uuid, code });
  };

  const renderTicketInfo = () => {
    if (ticketUser && ticket.status !== 'pending') {
      return (
        <>
          <Badge
            className={classes.Radiusdot}
            badgeContent={`${ticketUser}`}
            //color="primary"
            style={{
              backgroundColor: '#3498db',
              height: 18,
              padding: 5,
              position: 'inherit',
              borderRadius: 7,
              color: '#fff',
              top: -6,
              marginRight: 3,
            }}
          />

          {ticket.whatsappId && (
            <Badge
              className={classes.Radiusdot}
              badgeContent={`${whatsAppName}`}
              style={{
                backgroundColor: '#7d79f2',
                height: 18,
                padding: 5,
                position: 'inherit',
                borderRadius: 7,
                color: 'white',
                top: -6,
                marginRight: 3,
              }}
            />
          )}

          {ticket.queue?.name !== null && (
            <Badge
              className={classes.Radiusdot}
              style={{
                backgroundColor: ticket.queue?.color || '#7C7C7C',
                height: 18,
                padding: 5,
                position: 'inherit',
                borderRadius: 7,
                color: 'white',
                top: -6,
                marginRight: 3,
              }}
              badgeContent={
                ticket.queue?.name || i18n.t('internalChat.noQueue')
              }
            />
          )}
          {ticket.status === 'open' && (
            <Tooltip title={i18n.t('tickets.tooltips.closeConversation')}>
              <X
                onClick={() => handleCloseTicket(ticket.id)}
                className={classes.actionIcon}
                size={12}
              />
            </Tooltip>
          )}
          {profile === 'admin' && (
            <Tooltip title={i18n.t('internalChat.spyChat')}>
              <Eye
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenTicketMessageDialog(true);
                }}
                fontSize='small'
                style={{
                  padding: 2,
                  height: 23,
                  width: 23,
                  fontSize: 12,
                  color: '#fff',
                  cursor: 'pointer',
                  backgroundColor: blue[700],
                  borderRadius: 50,
                  position: 'absolute',
                  right: 28,
                  top: -8,
                }}
              />
            </Tooltip>
          )}
          {ticket.chatbot && (
            <Tooltip title='Chatbot'>
              <Smartphone
                fontSize='small'
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}
        </>
      );
    } else {
      return (
        <>
          {ticket.whatsappId && (
            <Badge
              className={classes.Radiusdot}
              badgeContent={`${whatsAppName}`}
              style={{
                backgroundColor: '#7d79f2',
                height: 18,
                padding: 5,
                position: 'inherit',
                borderRadius: 7,
                color: 'white',
                top: -6,
                marginRight: 3,
              }}
            />
          )}

          {ticket.queue?.name !== null && (
            <Badge
              className={classes.Radiusdot}
              style={{
                backgroundColor: ticket.queue?.color || '#7C7C7C',
                height: 18,
                padding: 5,
                paddingHorizontal: 12,
                position: 'inherit',
                borderRadius: 7,
                color: 'white',
                top: -6,
                marginRight: 2,
              }}
              badgeContent={
                ticket.queue?.name || i18n.t('internalChat.noQueue')
              }
            />
          )}
          {ticket.status === 'pending' &&
            (groupActionButtons || !ticket.isGroup) && (
              <Tooltip title={i18n.t('tickets.tooltips.closeConversation')}>
                <X
                  onClick={() => handleCloseTicket(ticket.id)}
                  className={classes.actionIcon}
                  size={12}
                />
              </Tooltip>
            )}
          {ticket.chatbot && (
            <Tooltip title='Chatbot'>
              <Smartphone
                fontSize='small'
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}
          {ticket.status === 'open' &&
            (groupActionButtons || !ticket.isGroup) && (
              <Tooltip title={i18n.t('tickets.tooltips.closeConversation')}>
                <X
                  onClick={() => handleCloseTicket(ticket.id)}
                  className={classes.actionIcon}
                  size={12}
                />
              </Tooltip>
            )}
          {ticket.status === 'pending' &&
            (groupActionButtons || !ticket.isGroup) && (
              <Tooltip title={i18n.t('internalChat.acceptChat')}>
                <Check
                  onClick={() => handleAcceptTicket(ticket.id)}
                  fontSize='small'
                  style={{
                    color: '#fff',
                    backgroundColor: green[700],
                    cursor: 'pointer',
                    //margin: '0 5 0 5',
                    padding: 2,
                    height: 23,
                    width: 23,
                    fontSize: 12,
                    borderRadius: 50,
                    right: 25,
                    top: -8,
                    position: 'absolute',
                  }}
                />
              </Tooltip>
            )}

          {profile === 'admin' && (groupActionButtons || !ticket.isGroup) && (
            <Tooltip title={i18n.t('internalChat.spyChat')}>
              <Eye
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenTicketMessageDialog(true);
                }}
                fontSize='small'
                style={{
                  padding: 2,
                  height: 23,
                  width: 23,
                  fontSize: 12,
                  color: '#fff',
                  cursor: 'pointer',
                  backgroundColor: blue[700],
                  borderRadius: 50,
                  right: 0,
                  top: -8,
                  position: 'absolute',
                }}
              />
            </Tooltip>
          )}
        </>
      );
    }
  };

  return (
    <React.Fragment key={ticket.id}>
      <TicketMessagesDialog
        open={openTicketMessageDialog}
        handleClose={() => setOpenTicketMessageDialog(false)}
        ticketId={ticket.id}
      ></TicketMessagesDialog>
      <ListItem
        dense
        button
        onClick={(e) => {
          if (
            (groupActionButtons || !ticket.isGroup) &&
            ticket.status === 'pending'
          )
            return;
          handleSelectTicket(ticket);
        }}
        selected={ticketId && +ticketId === ticket.id}
        className={clsx(classes.ticket, {
          [classes.pendingTicket]: ticket.status === 'pending',
        })}
      >
        <Tooltip
          arrow
          placement='right'
          title={ticket.queue?.name || i18n.t('internalChat.noQueue')}
        >
          <span
            style={{ backgroundColor: ticket.queue?.color || '#7C7C7C' }}
            className={classes.ticketQueueColor}
          ></span>
        </Tooltip>
        <ListItemAvatar>
          <Avatar
            style={{
              backgroundColor: generateColor(ticket?.contact?.number),
              color: 'white',
              fontWeight: 'bold',
            }}
            src={ticket?.contact?.profilePicUrl}
          >
            {getInitials(ticket?.contact?.name || '')}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          style={{ paddingBottom: 10 }}
          disableTypography
          primary={
            <span className={classes.contactNameWrapper}>
              <Typography
                noWrap
                component='span'
                variant='body2'
                color='textPrimary'
              >
                {ticket.channel === 'whatsapp' && (
                  <Tooltip
                    title={`${i18n.t('internalChat.assignedTo')} ${ticketUser}`}
                  >
                    <WhatsAppIcon
                      fontSize='inherit'
                      style={{ color: grey[700] }}
                    />
                  </Tooltip>
                )}{' '}
                {ticket.contact.name}
              </Typography>
            </span>
          }
          secondary={
            <span className={classes.contactNameWrapper}>
              <Typography
                className={classes.contactLastMessage}
                noWrap
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {['composing', 'recording'].includes(ticket?.presence) ? (
                  <span className={classes.presence}>
                    {i18n.t(`presence.${ticket.presence}`)}
                  </span>
                ) : (
                  <>
                    {ticket.lastMessage?.includes('data:image/png;base64') ? (
                      <div>{i18n.t('internalChat.location')}</div>
                    ) : (
                      <WhatsMarked oneline>
                        {ticket.lastMessage.startsWith('{"ticketzvCard"')
                          ? '🪪'
                          : ticket.lastMessage.split('\n')[0]}
                      </WhatsMarked>
                    )}
                  </>
                )}
              </Typography>
              <TagsLine ticket={ticket} />
              <ListItemSecondaryAction style={{ left: 73 }}>
                <Box className={classes.ticketInfo1}>{renderTicketInfo()}</Box>
              </ListItemSecondaryAction>
            </span>
          }
        />
        <ListItemSecondaryAction style={{}}>
          {ticket.status === 'closed' && (
            <Badge
              className={classes.Radiusdot}
              badgeContent={i18n.t('tickets.status.closed')}
              style={{
                backgroundColor: ticket.queue?.color || '#ff0000',
                height: 18,
                padding: 5,
                paddingHorizontal: 12,
                borderRadius: 7,
                color: 'white',
                top: -28,
                marginRight: 5,
              }}
            />
          )}

          {ticket.lastMessage && (
            <>
              <Typography
                className={classes.lastMessageTime}
                component='span'
                variant='body2'
                color='textSecondary'
              >
                {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                  <>{format(parseISO(ticket.updatedAt), 'HH:mm')}</>
                ) : (
                  <>{format(parseISO(ticket.updatedAt), 'dd/MM/yyyy')}</>
                )}
              </Typography>

              {ticket.unreadMessages > 0 && (
                <>
                  <Badge
                    badgeContent={ticket.unreadMessages}
                    color='error'
                    className={classes.newMessagesCount}
                    classes={{
                      badge: classes.badgeStyle,
                    }}
                  >
                    <MessageSquare size={20} />
                  </Badge>
                  <br />
                </>
              )}
            </>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant='inset' component='li' />
    </React.Fragment>
  );
};

export default TicketListItemCustom;
