import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { i18n } from '../../translate/i18n';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import Title from '../../components/Title';
import toastError from '../../errors/toastError';
import api from '../../services/api';
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

const Leads = () => {
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

  const getStageColor = (stage) => {
    const colors = {
      new: '#6c5ce7',
      contacted: '#00b894',
      qualified: '#0984e3',
      proposal: '#fdcb6e',
      negotiation: '#e17055',
      closed_won: '#00b894',
      closed_lost: '#d63031',
    };
    return colors[stage] || '#6c5ce7';
  };

  const getTemperatureColor = (temperature) => {
    const colors = {
      hot: classes.hotChip,
      warm: classes.warmChip,
      cold: classes.coldChip,
    };
    return colors[temperature] || classes.coldChip;
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
                  <SearchIcon style={{ color: 'gray' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button variant='contained' color='primary' onClick={handleOpenModal}>
            <PersonAddIcon style={{ marginRight: '5px' }} />
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
              <TableCell>{i18n.t('leads.table.stage')}</TableCell>
              <TableCell>{i18n.t('leads.table.temperature')}</TableCell>
              <TableCell>{i18n.t('leads.table.source')}</TableCell>
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
                    label={i18n.t(`leads.stages.${lead.stage}`)}
                    style={{
                      backgroundColor: getStageColor(lead.stage),
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
                  {lead.expectedValue?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
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
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDelete(lead.id)}
                  >
                    <DeleteIcon />
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

export default Leads;
