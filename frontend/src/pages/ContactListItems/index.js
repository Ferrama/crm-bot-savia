import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import ConfirmationModal from '../../components/ConfirmationModal/';
import ContactListItemModal from '../../components/ContactListItemModal';
import ContactSelectorModal from '../../components/ContactSelectorModal';
import TableRowSkeleton from '../../components/TableRowSkeleton';
import api from '../../services/api';

import { Grid } from '@material-ui/core';
import { Can } from '../../components/Can';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import Title from '../../components/Title';
import { AuthContext } from '../../context/Auth/AuthContext';
import toastError from '../../errors/toastError';
import useContactLists from '../../hooks/useContactLists';
import { i18n } from '../../translate/i18n';

import {
  Ban,
  CheckCircle,
  ChevronLeft,
  Edit,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import planilhaExemplo from '../../assets/planilha.xlsx';
import { SocketContext } from '../../context/Socket/SocketContext';

const reducer = (state, action) => {
  if (action.type === 'LOAD_CONTACTS') {
    const contacts = action.payload;
    const newContacts = [];

    contacts.forEach((contact) => {
      const contactIndex = state.findIndex((c) => c.id === contact.id);
      if (contactIndex !== -1) {
        state[contactIndex] = contact;
      } else {
        newContacts.push(contact);
      }
    });

    return [...state, ...newContacts];
  }

  if (action.type === 'UPDATE_CONTACTS') {
    const contact = action.payload;
    const contactIndex = state.findIndex((c) => c.id === contact.id);

    if (contactIndex !== -1) {
      state[contactIndex] = contact;
      return [...state];
    } else {
      return [contact, ...state];
    }
  }

  if (action.type === 'DELETE_CONTACT') {
    const contactId = action.payload;

    const contactIndex = state.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      state.splice(contactIndex, 1);
    }
    return [...state];
  }

  if (action.type === 'RESET') {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: 'scroll',
    ...theme.scrollbarStyles,
  },
}));

const ContactListItems = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);
  const { contactListId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState('');
  const [contacts, dispatch] = useReducer(reducer, []);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactListItemModalOpen, setContactListItemModalOpen] =
    useState(false);
  const [contactSelectorModalOpen, setContactSelectorModalOpen] =
    useState(false);
  const [deletingContact, setDeletingContact] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [contactList, setContactList] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileUploadRef = useRef(null);

  const { findById: findContactList } = useContactLists();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    findContactList(contactListId).then((data) => {
      setContactList(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactListId]);

  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get(`contact-list-items`, {
            params: { searchParam, pageNumber, contactListId },
          });
          dispatch({ type: 'LOAD_CONTACTS', payload: data.contacts });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, contactListId, refreshTrigger]);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    const socket = socketManager.GetSocket(companyId);

    const onContactListItem = (data) => {
      if (data.action === 'update' || data.action === 'create') {
        dispatch({ type: 'UPDATE_CONTACTS', payload: data.record });
      }

      if (data.action === 'delete') {
        dispatch({ type: 'DELETE_CONTACT', payload: +data.id });
      }

      if (data.action === 'reload') {
        dispatch({ type: 'LOAD_CONTACTS', payload: data.records });
      }
    };

    const onContactListItemId = (data) => {
      if (data.action === 'reload') {
        dispatch({ type: 'LOAD_CONTACTS', payload: data.records });
      }
    };

    socket.on(`company-${companyId}-ContactListItem`, onContactListItem);
    socket.on(
      `company-${companyId}-ContactListItem-${contactListId}`,
      onContactListItemId
    );

    return () => {
      socket.disconnect();
    };
  }, [contactListId, socketManager]);

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenContactListItemModal = () => {
    setSelectedContactId(null);
    setContactListItemModalOpen(true);
  };

  const handleCloseContactListItemModal = () => {
    setSelectedContactId(null);
    setContactListItemModalOpen(false);
  };

  const hadleEditContact = (contactId) => {
    setSelectedContactId(contactId);
    setContactListItemModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.delete(`/contact-list-items/${contactId}`);
      toast.success(i18n.t('contacts.toasts.deleted'));
    } catch (err) {
      toastError(err);
    }
    setDeletingContact(null);
    setSearchParam('');
    setPageNumber(1);
  };

  const handleImportContacts = async () => {
    try {
      const formData = new FormData();
      formData.append('file', fileUploadRef.current.files[0]);
      await api.request({
        url: `contact-lists/${contactListId}/upload`,
        method: 'POST',
        data: formData,
      });
    } catch (err) {
      toastError(err);
    }
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const goToContactLists = () => {
    history.push('/contact-lists');
  };

  const handleOpenContactSelectorModal = () => {
    setContactSelectorModalOpen(true);
  };

  const handleCloseContactSelectorModal = () => {
    setContactSelectorModalOpen(false);
  };

  const handleContactsAdded = async () => {
    // Refresh the contact list after adding contacts
    dispatch({ type: 'RESET' });
    setPageNumber(1);
    setSearchParam('');

    // Force immediate reload
    setLoading(true);
    try {
      const { data } = await api.get(`contact-list-items`, {
        params: { searchParam: '', pageNumber: 1, contactListId },
      });
      dispatch({ type: 'LOAD_CONTACTS', payload: data.contacts });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  return (
    <MainContainer className={classes.mainContainer}>
      <ContactListItemModal
        open={contactListItemModalOpen}
        onClose={handleCloseContactListItemModal}
        aria-labelledby='form-dialog-title'
        contactId={selectedContactId}
      ></ContactListItemModal>
      <ContactSelectorModal
        open={contactSelectorModalOpen}
        onClose={handleCloseContactSelectorModal}
        contactListId={contactListId}
        onContactsAdded={handleContactsAdded}
      />
      <ConfirmationModal
        title={
          deletingContact
            ? `${i18n.t('contactListItems.confirmationModal.deleteTitle')} ${
                deletingContact.name
              }?`
            : `${i18n.t('contactListItems.confirmationModal.importTitlte')}`
        }
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={() =>
          deletingContact
            ? handleDeleteContact(deletingContact.id)
            : handleImportContacts()
        }
      >
        {deletingContact ? (
          `${i18n.t('contactListItems.confirmationModal.deleteMessage')}`
        ) : (
          <>
            {i18n.t('contactListItems.confirmationModal.importMessage')}
            <a href={planilhaExemplo} download='planilha.xlsx'>
              Clique aqui para baixar planilha exemplo.
            </a>
          </>
        )}
      </ConfirmationModal>
      <MainHeader>
        <Grid
          style={{ width: '99.6%' }}
          container
          justifyContent='space-between'
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              width: '33%',
              gap: '10px',
            }}
          >
            <Tooltip title={i18n.t('contactListItems.buttons.lists')}>
              <IconButton
                variant='contained'
                color='secondary'
                onClick={goToContactLists}
              >
                <ChevronLeft size={20} />
              </IconButton>
            </Tooltip>
            <Title>{contactList.name}</Title>
          </div>
          <Grid xs={12} sm={7} item>
            <Grid spacing={2} container>
              <Grid xs={12} sm={6} item>
                <TextField
                  fullWidth
                  placeholder={i18n.t('contactListItems.searchPlaceholder')}
                  type='search'
                  value={searchParam}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search style={{ color: 'gray' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <Grid spacing={1} container justifyContent='flex-end'>
                  <Grid item></Grid>
                  <Grid item>
                    <Tooltip title={i18n.t('contactListItems.buttons.import')}>
                      <IconButton
                        variant='contained'
                        color='secondary'
                        onClick={() => {
                          fileUploadRef.current.value = null;
                          fileUploadRef.current.click();
                        }}
                      >
                        <Upload size={20} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title={i18n.t('contactListItems.buttons.addFromSystem')}
                    >
                      <IconButton
                        variant='contained'
                        color='secondary'
                        onClick={handleOpenContactSelectorModal}
                      >
                        <Users size={20} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title={i18n.t('contactListItems.buttons.add')}>
                      <IconButton
                        variant='contained'
                        color='secondary'
                        onClick={handleOpenContactListItemModal}
                      >
                        <Plus size={20} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant='outlined'
        onScroll={handleScroll}
      >
        <>
          <input
            style={{ display: 'none' }}
            id='upload'
            name='file'
            type='file'
            accept='.xls,.xlsx'
            onChange={() => {
              setConfirmOpen(true);
            }}
            ref={fileUploadRef}
          />
        </>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='center' style={{ width: '0%' }}>
                #
              </TableCell>
              <TableCell>{i18n.t('contactListItems.table.name')}</TableCell>
              <TableCell align='center'>
                {i18n.t('contactListItems.table.number')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('contactListItems.table.email')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('contactListItems.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell align='center' style={{ width: '0%' }}>
                    <IconButton variant='contained' color='secondary'>
                      {contact.isWhatsappValid ? (
                        <CheckCircle
                          titleAccess='Whatsapp Válido'
                          color='green'
                          size={20}
                        />
                      ) : (
                        <Ban
                          titleAccess='Whatsapp Inválido'
                          color='grey'
                          size={20}
                        />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell align='center'>{contact.number}</TableCell>
                  <TableCell align='center'>{contact.email}</TableCell>
                  <TableCell align='center'>
                    <IconButton
                      size='small'
                      variant='contained'
                      color='secondary'
                      onClick={() => hadleEditContact(contact.id)}
                    >
                      <Edit size={20} />
                    </IconButton>
                    <Can
                      role={user.profile}
                      perform='contacts-page:deleteContact'
                      yes={() => (
                        <IconButton
                          size='small'
                          variant='contained'
                          color='secondary'
                          onClick={() => {
                            setConfirmOpen(true);
                            setDeletingContact(contact);
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default ContactListItems;
