import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Calendar,
  DollarSign,
  Edit,
  Percent,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import Title from '../../components/Title';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import LeadModal from './LeadModal';

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: 'scroll',
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageChip: {
    margin: theme.spacing(0.5),
  },
  temperatureChip: {
    margin: theme.spacing(0.5),
  },
  hotChip: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  warmChip: {
    backgroundColor: '#ffd93d',
    color: 'black',
  },
  coldChip: {
    backgroundColor: '#6c5ce7',
    color: 'white',
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  leadInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  leadName: {
    fontWeight: 'bold',
  },
  leadTitle: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  leadDescription: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
  },
  contactName: {
    fontWeight: 'bold',
  },
  contactDetails: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  userAvatar: {
    width: 24,
    height: 24,
    fontSize: '0.75rem',
  },
  tagChip: {
    margin: theme.spacing(0.25),
    height: 20,
    fontSize: '0.7rem',
  },
  financialInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
    fontSize: '0.875rem',
  },
  financialItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  financialIcon: {
    width: 14,
    height: 14,
  },
}));

const LeadList = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam, setSearchParam] = useState('');

  useEffect(() => {
    loadLeads();
  }, [pageNumber, searchParam]);

  const loadLeads = async () => {
    try {
      const { data } = await api.get('/leads', {
        params: { searchParam, pageNumber },
      });
      setLeads(data.leads);
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenModal = () => {
    setSelectedLead(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setShowModal(false);
    loadLeads();
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleDelete = async (leadId) => {
    try {
      await api.delete(`/leads/${leadId}`);
      toast.success(i18n.t('leads.toasts.deleted'));
      loadLeads();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const getTemperatureColor = (temperature) => {
    const colors = {
      hot: classes.hotChip,
      warm: classes.warmChip,
      cold: classes.coldChip,
    };
    return colors[temperature] || classes.coldChip;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#2196f3',
      contacted: '#ff9800',
      follow_up: '#9c27b0',
      proposal: '#4caf50',
      negotiation: '#ff5722',
      qualified: '#00bcd4',
      unqualified: '#f44336',
      converted: '#4caf50',
      lost: '#f44336',
      closed_won: '#4caf50',
      closed_lost: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const formatExpectedValue = (lead) => {
    if (!lead.expectedValue) return '';
    const currency = lead.currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.code || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lead.expectedValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t('leads.title')}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t('leads.searchPlaceholder')}
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
          <Button variant='contained' color='primary' onClick={handleOpenModal}>
            <UserPlus style={{ marginRight: '5px' }} />
            {i18n.t('leads.buttons.add')}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>{i18n.t('leads.table.lead')}</TableCell>
              <TableCell>{i18n.t('leads.table.contact')}</TableCell>
              <TableCell>{i18n.t('leads.table.status')}</TableCell>
              <TableCell>{i18n.t('leads.table.pipeline')}</TableCell>
              <TableCell>{i18n.t('leads.table.column')}</TableCell>
              <TableCell>{i18n.t('leads.table.temperature')}</TableCell>
              <TableCell>{i18n.t('leads.table.tags')}</TableCell>
              <TableCell>{i18n.t('leads.table.financial')}</TableCell>
              <TableCell>{i18n.t('leads.table.assignedTo')}</TableCell>
              <TableCell align='center'>
                {i18n.t('leads.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className={classes.leadInfo}>
                    <div className={classes.leadName}>{lead.name}</div>
                    {lead.title && (
                      <div className={classes.leadTitle}>{lead.title}</div>
                    )}
                    {lead.description && (
                      <div className={classes.leadDescription}>
                        {lead.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.contactInfo}>
                    <div className={classes.contactName}>
                      {lead.contact?.name}
                    </div>
                    <div className={classes.contactDetails}>
                      {lead.contact?.number}
                    </div>
                    {lead.contact?.email && (
                      <div className={classes.contactDetails}>
                        {lead.contact.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={i18n.t(`leads.status.${lead.status}`)}
                    className={classes.statusChip}
                    style={{
                      backgroundColor: getStatusColor(lead.status),
                      color: 'white',
                    }}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={i18n.t(`leads.pipeline.${lead.pipeline}`)}
                    className={classes.stageChip}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.column?.name}
                    style={{
                      backgroundColor: lead.column?.color,
                      color: 'white',
                    }}
                    size='small'
                    className={classes.stageChip}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={i18n.t(`leads.temperature.${lead.temperature}`)}
                    className={`${
                      classes.temperatureChip
                    } ${getTemperatureColor(lead.temperature)}`}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Box display='flex' flexWrap='wrap' maxWidth={150}>
                    {lead.tags?.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        className={classes.tagChip}
                        size='small'
                      />
                    ))}
                    {lead.tags?.length > 3 && (
                      <Chip
                        label={`+${lead.tags.length - 3}`}
                        className={classes.tagChip}
                        size='small'
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <div className={classes.financialInfo}>
                    {lead.expectedValue && (
                      <div className={classes.financialItem}>
                        <DollarSign className={classes.financialIcon} />
                        <span>{formatExpectedValue(lead)}</span>
                      </div>
                    )}
                    {lead.probability && (
                      <div className={classes.financialItem}>
                        <Percent className={classes.financialIcon} />
                        <span>{lead.probability}%</span>
                      </div>
                    )}
                    {lead.expectedClosingDate && (
                      <div className={classes.financialItem}>
                        <Calendar className={classes.financialIcon} />
                        <span>{formatDate(lead.expectedClosingDate)}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {lead.assignedTo ? (
                    <div className={classes.assignedUser}>
                      <Avatar className={classes.userAvatar}>
                        {getInitials(lead.assignedTo.name)}
                      </Avatar>
                      <Typography variant='caption'>
                        {lead.assignedTo.name}
                      </Typography>
                    </div>
                  ) : (
                    <Typography variant='caption' color='textSecondary'>
                      {i18n.t('leads.table.unassigned')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleEdit(lead)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDelete(lead.id)}
                  >
                    <Trash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <LeadModal
        open={showModal}
        onClose={handleCloseModal}
        reload={loadLeads}
        lead={selectedLead}
      />
    </MainContainer>
  );
};

export default LeadList;
