import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useReducer, useState } from 'react';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import SubscriptionModal from '../../components/SubscriptionModal';
import TableRowSkeleton from '../../components/TableRowSkeleton';
import Title from '../../components/Title';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

import toastError from '../../errors/toastError';

import moment from 'moment';

const reducer = (state, action) => {
  if (action.type === 'LOAD_INVOICES') {
    const invoices = action.payload;
    const newUsers = [];

    invoices.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === 'UPDATE_USERS') {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === 'DELETE_USER') {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
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

const Invoices = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam] = useState('');
  const [invoices, dispatch] = useReducer(reducer, []);
  const [storagePlans, setStoragePlans] = React.useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContactModal = (invoices) => {
    setStoragePlans(invoices);
    setSelectedContactId(null);
    setContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    setContactModalOpen(false);
  };
  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchInvoices = async () => {
        try {
          const { data } = await api.get('/invoices/all', {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: 'LOAD_INVOICES', payload: data });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchInvoices();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

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
  const rowStyle = (record) => {
    const hoje = moment(moment()).format('DD/MM/yyyy');
    const vencimento = moment(record.dueDate).format('DD/MM/yyyy');
    var diff = moment(vencimento, 'DD/MM/yyyy').diff(
      moment(hoje, 'DD/MM/yyyy')
    );
    var dias = moment.duration(diff).asDays();
    if (dias < 0 && record.status !== 'paid') {
      return { backgroundColor: '#ffbcbc9c' };
    }
  };

  const rowStatus = (record) => {
    const hoje = moment(moment()).format('DD/MM/yyyy');
    const vencimento = moment(record.dueDate).format('DD/MM/yyyy');
    var diff = moment(vencimento, 'DD/MM/yyyy').diff(
      moment(hoje, 'DD/MM/yyyy')
    );
    var dias = moment.duration(diff).asDays();
    const status = record.status;
    if (status === 'paid') {
      return i18n.t('financeiro.status.paid');
    }
    if (dias < 0) {
      return i18n.t('financeiro.status.overdue');
    } else {
      return i18n.t('financeiro.status.open');
    }
  };

  return (
    <MainContainer>
      <SubscriptionModal
        open={contactModalOpen}
        onClose={handleCloseContactModal}
        aria-labelledby='form-dialog-title'
        Invoice={storagePlans}
        contactId={selectedContactId}
      ></SubscriptionModal>
      <MainHeader>
        <Title>{i18n.t('financeiro.title')}</Title>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant='outlined'
        onScroll={handleScroll}
      >
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                {i18n.t('financeiro.table.id')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('financeiro.table.details')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('financeiro.table.value')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('financeiro.table.dueDate')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('financeiro.table.status')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('financeiro.table.action')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {invoices.map((invoices) => (
                <TableRow style={rowStyle(invoices)} key={invoices.id}>
                  <TableCell align='center'>{invoices.id}</TableCell>
                  <TableCell align='center'>{invoices.detail}</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align='center'>
                    {invoices.value.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell align='center'>
                    {moment(invoices.dueDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align='center'>
                    {rowStatus(invoices)}
                  </TableCell>
                  <TableCell align='center'>
                    {rowStatus(invoices) !==
                    i18n.t('financeiro.status.paid') ? (
                      <Button
                        size='small'
                        variant='outlined'
                        color='secondary'
                        onClick={() => handleOpenContactModal(invoices)}
                      >
                        {i18n.t('financeiro.buttons.pay')}
                      </Button>
                    ) : (
                      <Button
                        size='small'
                        variant='outlined'
                        /* color="secondary"
                        disabled */
                      >
                        {i18n.t('financeiro.buttons.paid')}
                      </Button>
                    )}
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

export default Invoices;
