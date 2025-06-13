import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

import { format, parseISO } from 'date-fns';

import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  timestamp: {
    minWidth: 250,
  },
}));

const MessageHistoryModal = ({ open, onClose, oldMessages }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby='dialog-title'
    >
      <DialogTitle id='dialog-title'>
        {i18n.t('messageHistoryModal.title')}
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table aria-label='message-history-table'>
            <TableBody>
              {oldMessages &&
                oldMessages.map((oldMessage) => (
                  <TableRow key={oldMessage.id}>
                    <TableCell component='th' scope='row'>
                      {oldMessage.body}
                    </TableCell>
                    <TableCell align='right' className={classes.timestamp}>
                      {format(parseISO(oldMessage.createdAt), 'dd/MM HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          color='secondary'
          variant='contained'
        >
          {i18n.t('confirmationModal.buttons.cancel')}
        </Button>
        <Button
          onClick={() => onClose(false)}
          color='primary'
          variant='contained'
        >
          {i18n.t('messageHistoryModal.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageHistoryModal;
