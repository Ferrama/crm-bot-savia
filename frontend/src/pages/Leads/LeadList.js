import {
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Search, Trash2, UserPlus } from 'lucide-react';
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

  const formatExpectedValue = (lead) => {
    if (!lead.expectedValue) return '';
    const currency = lead.currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lead.expectedValue);
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
              <TableCell>{i18n.t('leads.table.name')}</TableCell>
              <TableCell>{i18n.t('leads.table.contact')}</TableCell>
              <TableCell>{i18n.t('leads.table.column')}</TableCell>
              <TableCell>{i18n.t('leads.table.temperature')}</TableCell>
              <TableCell>{i18n.t('leads.table.source')}</TableCell>
              <TableCell>{i18n.t('leads.table.tags')}</TableCell>
              <TableCell>{i18n.t('leads.table.expectedValue')}</TableCell>
              <TableCell>{i18n.t('leads.table.probability')}</TableCell>
              <TableCell>{i18n.t('leads.table.expectedClosingDate')}</TableCell>
              <TableCell>{i18n.t('leads.table.assignedTo')}</TableCell>
              <TableCell align='center'>
                {i18n.t('leads.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.contact.name}</TableCell>
                <TableCell>
                  {lead.contact.number}
                  <br />
                  {lead.contact.email}
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.column.name}
                    style={{
                      backgroundColor: lead.column.color,
                      color: 'white',
                    }}
                    size='small'
                    className={classes.stageChip}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={i18n.t(`leads.temperatures.${lead.temperature}`)}
                    className={`${
                      classes.temperatureChip
                    } ${getTemperatureColor(lead.temperature)}`}
                    size='small'
                  />
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  {lead.tags?.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size='small'
                      style={{
                        backgroundColor: tag.color || '#ccc',
                        color: 'white',
                        margin: '2px',
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>{formatExpectedValue(lead)}</TableCell>
                <TableCell>{lead.probability}%</TableCell>
                <TableCell>
                  {lead.expectedClosingDate &&
                    format(new Date(lead.expectedClosingDate), 'dd/MM/yyyy', {
                      locale: ptBR,
                    })}
                </TableCell>
                <TableCell>{lead.assignedTo?.name}</TableCell>
                <TableCell align='center'>
                  <IconButton size='small' onClick={() => handleEdit(lead)}>
                    <Edit size={20} />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDelete(lead.id)}
                  >
                    <Trash2 size={20} />
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
