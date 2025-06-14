import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVertical, RotateCcw } from 'lucide-react';

import { AuthContext } from '../../context/Auth/AuthContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import ButtonWithSpinner from '../ButtonWithSpinner';
import TicketOptionsMenu from '../TicketOptionsMenu';

const useStyles = makeStyles((theme) => ({
  actionButtons: {
    marginRight: 6,
    flex: 'none',
    alignSelf: 'center',
    marginLeft: 'auto',
    '& > *': {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  },
}));

const TicketActionButtons = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const ticketOptionsMenuOpen = Boolean(anchorEl);
  const { user } = useContext(AuthContext);

  const handleOpenTicketOptionsMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseTicketOptionsMenu = (e) => {
    setAnchorEl(null);
  };

  const handleUpdateTicketStatus = async (e, status, userId) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: status,
        userId: userId || null,
      });

      setLoading(false);
      if (status === 'open') {
        history.push(`/tickets/${ticket.id}`);
      } else {
        history.push('/tickets');
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  return (
    <div className={classes.actionButtons}>
      {ticket.status === 'closed' && (
        <ButtonWithSpinner
          loading={loading}
          startIcon={<RotateCcw />}
          size='small'
          onClick={(e) => handleUpdateTicketStatus(e, 'open', user?.id)}
        >
          {i18n.t('messagesList.header.buttons.reopen')}
        </ButtonWithSpinner>
      )}
      {ticket.status === 'open' && (
        <>
          <ButtonWithSpinner
            loading={loading}
            startIcon={<RotateCcw />}
            size='small'
            onClick={(e) => handleUpdateTicketStatus(e, 'pending', null)}
          >
            {i18n.t('messagesList.header.buttons.return')}
          </ButtonWithSpinner>
          <ButtonWithSpinner
            loading={loading}
            size='small'
            variant='contained'
            color='primary'
            onClick={(e) => handleUpdateTicketStatus(e, 'closed', user?.id)}
          >
            {i18n.t('messagesList.header.buttons.resolve')}
          </ButtonWithSpinner>
          <IconButton onClick={handleOpenTicketOptionsMenu}>
            <MoreVertical />
          </IconButton>
          <TicketOptionsMenu
            ticket={ticket}
            anchorEl={anchorEl}
            menuOpen={ticketOptionsMenuOpen}
            handleClose={handleCloseTicketOptionsMenu}
          />
        </>
      )}
      {ticket.status === 'pending' && (
        <ButtonWithSpinner
          loading={loading}
          size='small'
          variant='contained'
          color='primary'
          onClick={(e) => handleUpdateTicketStatus(e, 'open', user?.id)}
        >
          {i18n.t('messagesList.header.buttons.accept')}
        </ButtonWithSpinner>
      )}
    </div>
  );
};

export default TicketActionButtons;
