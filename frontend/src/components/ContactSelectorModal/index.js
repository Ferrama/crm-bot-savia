import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { CheckCircle, Search } from 'lucide-react';

import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dialogContent: {
    minHeight: '400px',
    maxHeight: '600px',
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: '400px',
  },
  selectedCount: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
}));

const ContactSelectorModal = ({
  open,
  onClose,
  contactListId,
  onContactsAdded,
}) => {
  const classes = useStyles();

  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open, searchParam, pageNumber]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contacts', {
        params: { searchParam, pageNumber },
      });

      if (pageNumber === 1) {
        setContacts(data.contacts);
      } else {
        setContacts((prev) => [...prev, ...data.contacts]);
      }

      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedContacts([]);
    setSearchParam('');
    setPageNumber(1);
    setContacts([]);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
    setPageNumber(1);
  };

  const handleContactToggle = (contact) => {
    setSelectedContacts((prev) => {
      const isSelected = prev.find((c) => c.id === contact.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts([...contacts]);
    }
  };

  const handleAddContacts = async () => {
    if (selectedContacts.length === 0) {
      toast.warning(i18n.t('contactSelector.noContactsSelected'));
      return;
    }

    try {
      const promises = selectedContacts.map((contact) =>
        api.post('/contact-list-items', {
          name: contact.name,
          number: contact.number,
          email: contact.email,
          contactListId,
        })
      );

      await Promise.all(promises);

      toast.success(i18n.t('contactSelector.contactsAddedSuccess'));

      if (onContactsAdded) {
        onContactsAdded();
      }

      setTimeout(() => {
        handleClose();
      }, 100);
    } catch (err) {
      toastError(err);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        fullWidth
        scroll='paper'
      >
        <DialogTitle id='contact-selector-dialog-title'>
          {i18n.t('contactSelector.title')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent} dividers>
          <TextField
            fullWidth
            placeholder={i18n.t('contactSelector.searchPlaceholder')}
            type='search'
            value={searchParam}
            onChange={handleSearch}
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search style={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
          />

          {selectedContacts.length > 0 && (
            <Typography className={classes.selectedCount}>
              {i18n.t('contactSelector.selectedCount', {
                count: selectedContacts.length,
              })}
            </Typography>
          )}

          <TableContainer
            className={classes.tableContainer}
            component={Paper}
            onScroll={handleScroll}
          >
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      indeterminate={
                        selectedContacts.length > 0 &&
                        selectedContacts.length < contacts.length
                      }
                      checked={
                        contacts.length > 0 &&
                        selectedContacts.length === contacts.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>{i18n.t('contactSelector.table.name')}</TableCell>
                  <TableCell align='center'>
                    {i18n.t('contactSelector.table.number')}
                  </TableCell>
                  <TableCell align='center'>
                    {i18n.t('contactSelector.table.email')}
                  </TableCell>
                  <TableCell align='center'>
                    {i18n.t('contactSelector.table.status')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedContacts.some(
                          (c) => c.id === contact.id
                        )}
                        onChange={() => handleContactToggle(contact)}
                      />
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell align='center'>{contact.number}</TableCell>
                    <TableCell align='center'>{contact.email || '-'}</TableCell>
                    <TableCell align='center'>
                      {contact.isWhatsappValid ? (
                        <CheckCircle
                          titleAccess='Whatsapp Válido'
                          color='green'
                          size={20}
                        />
                      ) : (
                        <Typography variant='caption' color='textSecondary'>
                          Inválido
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} align='center'>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary' variant='contained'>
            {i18n.t('contactSelector.buttons.cancel')}
          </Button>
          <Button
            onClick={handleAddContacts}
            color='primary'
            variant='contained'
            disabled={selectedContacts.length === 0}
          >
            {i18n.t('contactSelector.buttons.add')} ({selectedContacts.length})
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactSelectorModal;
