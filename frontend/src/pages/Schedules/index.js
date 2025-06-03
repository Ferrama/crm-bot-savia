import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import { Edit, RefreshCw, Search, Trash2 } from 'lucide-react';

import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import Title from '../../components/Title';

import { capitalize } from 'lodash';
import moment from 'moment';
import ConfirmationModal from '../../components/ConfirmationModal';
import ScheduleModal from '../../components/ScheduleModal';
import TableRowSkeleton from '../../components/TableRowSkeleton';
import { AuthContext } from '../../context/Auth/AuthContext';
import { SocketContext } from '../../context/Socket/SocketContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

// A custom hook that builds on useLocation to parse
// the query string for you.
const getUrlParam = (param) => {
  return new URLSearchParams(window.location.search).get(param);
};

const reducer = (state, action) => {
  if (action.type === 'LOAD_SCHEDULES') {
    const schedules = action.payload;
    const newSchedules = [];

    schedules.forEach((schedule) => {
      const scheduleIndex = state.findIndex((s) => s.id === schedule.id);
      if (scheduleIndex !== -1) {
        state[scheduleIndex] = schedule;
      } else {
        newSchedules.push(schedule);
      }
    });

    return [...state, ...newSchedules];
  }

  if (action.type === 'UPDATE_SCHEDULES') {
    const schedule = action.payload;
    const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

    if (scheduleIndex !== -1) {
      state[scheduleIndex] = schedule;
      return [...state];
    } else {
      return [schedule, ...state];
    }
  }

  if (action.type === 'DELETE_SCHEDULE') {
    const scheduleId = action.payload;

    const scheduleIndex = state.findIndex((s) => s.id === scheduleId);
    if (scheduleIndex !== -1) {
      state.splice(scheduleIndex, 1);
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

const Schedules = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [schedules, dispatch] = useReducer(reducer, []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam('contactId'));
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      const { data } = await api.get('/schedules/', {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: 'LOAD_SCHEDULES', payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const handleOpenScheduleModalFromContactId = useCallback(() => {
    if (contactId) {
      handleOpenScheduleModal();
    }
  }, [contactId]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchSchedules();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    pageNumber,
    contactId,
    fetchSchedules,
    handleOpenScheduleModalFromContactId,
  ]);

  useEffect(() => {
    handleOpenScheduleModalFromContactId();
    const socket = socketManager.GetSocket(user.companyId);

    const onSchedule = (data) => {
      if (data.action === 'update' || data.action === 'create') {
        dispatch({
          type: 'UPDATE_SCHEDULES',
          payload: data?.schedules || data?.schedule,
        });
      }

      if (data.action === 'delete') {
        dispatch({ type: 'DELETE_USER', payload: +data.scheduleId });
      }
    };

    socket.on(`company-${user.companyId}-schedule`, onSchedule);

    return () => {
      socket.disconnect();
    };
  }, [handleOpenScheduleModalFromContactId, user, socketManager]);

  const cleanContact = () => {
    setContactId('');
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      toast.success(i18n.t('schedules.toasts.deleted'));
    } catch (err) {
      toastError(err);
    }
    setDeletingSchedule(null);
    setSearchParam('');
    setPageNumber(1);

    dispatch({ type: 'RESET' });
    setPageNumber(1);
    await fetchSchedules();
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

  const truncate = (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + '...';
    }
    return str;
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      dispatch({ type: 'RESET' });
      setPageNumber(1);
      await fetchSchedules();
      toast.success(i18n.t('common.refreshed'));
    } catch (err) {
      toastError(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingSchedule &&
          `${i18n.t('schedules.confirmationModal.deleteTitle')}`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteSchedule(deletingSchedule.id)}
      >
        {i18n.t('schedules.confirmationModal.deleteMessage')}
      </ConfirmationModal>
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        reload={fetchSchedules}
        aria-labelledby='form-dialog-title'
        scheduleId={selectedSchedule && selectedSchedule.id}
        contactId={contactId}
        cleanContact={cleanContact}
      />
      <MainHeader>
        <Title>{i18n.t('schedules.title')}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t('contacts.searchPlaceholder')}
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

          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw
              size={20}
              style={{
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </IconButton>

          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenScheduleModal}
          >
            {i18n.t('schedules.buttons.add')}
          </Button>
        </MainHeaderButtonsWrapper>
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
                {i18n.t('schedules.table.contact')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('schedules.table.body')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('schedules.table.sendAt')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('schedules.table.status')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('schedules.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell align='center'>{schedule.contact.name}</TableCell>
                  <TableCell align='center' title={schedule.body}>
                    {truncate(schedule.body, 25)}
                  </TableCell>
                  <TableCell align='center'>
                    {moment(schedule.sendAt).format('DD/MM/YYYY HH:mm:ss')}
                  </TableCell>
                  <TableCell align='center'>
                    {capitalize(schedule.status)}
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      size='small'
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <Edit size={20} />
                    </IconButton>

                    <IconButton
                      size='small'
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingSchedule(schedule);
                      }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
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

export default Schedules;
