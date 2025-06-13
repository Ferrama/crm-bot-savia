import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { DollarSign, FileText, Info, Tag, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '90vh',
    width: '95vw',
    maxWidth: '1400px !important',
    '&.MuiDialog-paper': {
      maxWidth: '1400px !important',
    },
  },
  leadModalDialog: {
    '& .MuiDialog-paper': {
      maxWidth: '1400px !important',
      width: '95vw !important',
    },
  },
  dialogContent: {
    padding: 0,
    display: 'flex',
    height: '100%',
    minHeight: '70vh',
  },
  sidebar: {
    width: 250,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarItem: {
    padding: theme.spacing(2, 3),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  sidebarItemActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  sidebarList: {
    flex: 1,
    padding: 0,
  },
  content: {
    flex: 1,
    padding: theme.spacing(3),
    overflowY: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  tagInput: {
    marginTop: theme.spacing(1),
  },
  customField: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
    color:
      theme.palette.mode === 'light' ? theme.palette.primary.main : '#F3F4F6',
  },
}));

const LeadModal = ({ open, onClose, reload, lead, columnId }) => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tags, setTags] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customFields, setCustomFields] = useState({});
  const [currenciesLoading, setCurrenciesLoading] = useState(false);

  // Global form state to maintain data across tabs
  const [globalFormData, setGlobalFormData] = useState({
    name: '',
    title: '',
    description: '',
    contactId: '',
    columnId: '',
    temperature: 'warm',
    status: 'new',
    pipeline: 'default',
    source: '',
    currencyId: '',
    probability: 50,
    expectedValue: '',
    expectedClosingDate: '',
    assignedToId: '',
    notes: '',
  });

  const sections = [
    { id: 0, label: i18n.t('leads.tabs.basic'), icon: <Info /> },
    { id: 1, label: i18n.t('leads.tabs.contact'), icon: <User /> },
    { id: 2, label: i18n.t('leads.tabs.financial'), icon: <DollarSign /> },
    { id: 3, label: i18n.t('leads.tabs.tags'), icon: <Tag /> },
    { id: 4, label: i18n.t('leads.tabs.notes'), icon: <FileText /> },
  ];

  useEffect(() => {
    if (open && !dataLoaded) {
      setLoading(true);

      // Initialize global form data
      const initialData = {
        name: lead?.name || '',
        title: lead?.title || '',
        description: lead?.description || '',
        contactId: lead?.contactId || '',
        columnId: lead?.columnId || columnId || '',
        temperature: lead?.temperature || 'warm',
        status: lead?.status || 'new',
        pipeline: lead?.pipeline || 'default',
        source: lead?.source || '',
        currencyId: lead?.currencyId || '',
        probability: lead?.probability || 50,
        expectedValue: lead?.expectedValue || '',
        expectedClosingDate: lead?.expectedClosingDate
          ? lead.expectedClosingDate.split('T')[0]
          : '',
        assignedToId: lead?.assignedToId || '',
        notes: lead?.notes || '',
      };
      setGlobalFormData(initialData);

      Promise.all([
        loadContacts(),
        loadUsers(),
        loadColumns(),
        loadTags(),
        loadCurrencies(),
      ])
        .then(() => {
          if (lead) {
            setSelectedTags(lead.tags || []);
            setCustomFields(lead.customFields || {});
          }
          setDataLoaded(true);
        })
        .catch((error) => {
          console.error('Error loading data:', error);
          toast.error('Error loading data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, lead, dataLoaded, columnId]);

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data.contacts || []);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setContacts([]);
      throw err;
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
      throw err;
    }
  };

  const loadColumns = async () => {
    try {
      const { data } = await api.get('/lead-columns');
      setColumns(data.leadColumns || []);
    } catch (err) {
      console.error('Error loading columns:', err);
      setColumns([]);
      throw err;
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await api.get('/tags');
      setTags(data.tags || []);
    } catch (err) {
      console.error('Error loading tags:', err);
      setTags([]);
      throw err;
    }
  };

  const loadCurrencies = async () => {
    setCurrenciesLoading(true);
    try {
      console.log('Loading currencies...');

      // Try different possible endpoints
      let currenciesData = [];

      try {
        const { data } = await api.get('/currencies');
        console.log('Currencies response:', data);
        currenciesData = data.currencies || data || [];
      } catch (firstError) {
        console.log('First endpoint failed, trying alternative...');
        try {
          const { data } = await api.get('/currency');
          console.log('Alternative currencies response:', data);
          currenciesData = data.currencies || data || [];
        } catch (secondError) {
          console.log(
            'Alternative endpoint also failed, trying /settings/currencies...'
          );
          try {
            const { data } = await api.get('/settings/currencies');
            console.log('Settings currencies response:', data);
            currenciesData = data.currencies || data || [];
          } catch (thirdError) {
            console.error('All currency endpoints failed');
            throw thirdError;
          }
        }
      }

      console.log('Final processed currencies:', currenciesData);
      setCurrencies(currenciesData);

      if (currenciesData.length === 0) {
        console.warn(
          'No currencies loaded, this might be expected if the endpoint is not implemented'
        );
      }
    } catch (err) {
      console.error('Error loading currencies:', err);
      console.error('Error response:', err.response);
      setCurrencies([]);
      // Don't throw error to prevent blocking other data loading
      toast.warning(
        'Could not load currencies. You can still create the lead.'
      );
    } finally {
      setCurrenciesLoading(false);
    }
  };

  const handleClose = () => {
    setActiveSection(0);
    setSelectedTags([]);
    setCustomFields({});
    setDataLoaded(false);
    onClose();
  };

  // Sync global form data with Formik
  useEffect(() => {
    if (dataLoaded) {
      // This will trigger Formik to reinitialize with the global data
    }
  }, [globalFormData, dataLoaded]);

  const handleCustomFieldDelete = (key) => {
    const newCustomFields = { ...customFields };
    delete newCustomFields[key];
    setCustomFields(newCustomFields);
  };

  const updateGlobalFormData = (field, value) => {
    setGlobalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const leadData = {
        ...globalFormData,
        tags: selectedTags,
        customFields,
      };

      if (lead) {
        await api.put(`/leads/${lead.id}`, leadData);
        toast.success(i18n.t('leads.toasts.updated'));
      } else {
        await api.post('/leads', leadData);
        toast.success(i18n.t('leads.toasts.created'));
      }

      reload();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving lead');
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

  const handleCustomFieldChange = (key, value) => {
    setCustomFields({ ...customFields, [key]: value });
  };

  const renderBasicInfo = () => (
    <Box>
      <Typography variant='h5' className={classes.sectionTitle}>
        {i18n.t('leads.tabs.basic')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.name')}
            value={globalFormData.name}
            onChange={(e) => updateGlobalFormData('name', e.target.value)}
            variant='outlined'
            margin='dense'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.title')}
            value={globalFormData.title}
            onChange={(e) => updateGlobalFormData('title', e.target.value)}
            variant='outlined'
            margin='dense'
            helperText={i18n.t('leads.form.titleHelper')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.description')}
            value={globalFormData.description}
            onChange={(e) =>
              updateGlobalFormData('description', e.target.value)
            }
            variant='outlined'
            margin='dense'
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.temperature')}</InputLabel>
            <Select
              value={globalFormData.temperature}
              onChange={(e) =>
                updateGlobalFormData('temperature', e.target.value)
              }
              label={i18n.t('leads.form.temperature')}
            >
              <MenuItem value='cold'>
                {i18n.t('leads.temperature.cold')}
              </MenuItem>
              <MenuItem value='warm'>
                {i18n.t('leads.temperature.warm')}
              </MenuItem>
              <MenuItem value='hot'>{i18n.t('leads.temperature.hot')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.status')}</InputLabel>
            <Select
              value={globalFormData.status}
              onChange={(e) => updateGlobalFormData('status', e.target.value)}
              label={i18n.t('leads.form.status')}
            >
              <MenuItem value='new'>{i18n.t('leads.status.new')}</MenuItem>
              <MenuItem value='contacted'>
                {i18n.t('leads.status.contacted')}
              </MenuItem>
              <MenuItem value='follow_up'>
                {i18n.t('leads.status.follow_up')}
              </MenuItem>
              <MenuItem value='proposal'>
                {i18n.t('leads.status.proposal')}
              </MenuItem>
              <MenuItem value='negotiation'>
                {i18n.t('leads.status.negotiation')}
              </MenuItem>
              <MenuItem value='qualified'>
                {i18n.t('leads.status.qualified')}
              </MenuItem>
              <MenuItem value='unqualified'>
                {i18n.t('leads.status.unqualified')}
              </MenuItem>
              <MenuItem value='converted'>
                {i18n.t('leads.status.converted')}
              </MenuItem>
              <MenuItem value='lost'>{i18n.t('leads.status.lost')}</MenuItem>
              <MenuItem value='closed_won'>
                {i18n.t('leads.status.closed_won')}
              </MenuItem>
              <MenuItem value='closed_lost'>
                {i18n.t('leads.status.closed_lost')}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.pipeline')}</InputLabel>
            <Select
              value={globalFormData.pipeline}
              onChange={(e) => updateGlobalFormData('pipeline', e.target.value)}
              label={i18n.t('leads.form.pipeline')}
            >
              <MenuItem value='default'>
                {i18n.t('leads.pipeline.default')}
              </MenuItem>
              <MenuItem value='sales'>
                {i18n.t('leads.pipeline.sales')}
              </MenuItem>
              <MenuItem value='support'>
                {i18n.t('leads.pipeline.support')}
              </MenuItem>
              <MenuItem value='onboarding'>
                {i18n.t('leads.pipeline.onboarding')}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.source')}
            value={globalFormData.source}
            onChange={(e) => updateGlobalFormData('source', e.target.value)}
            variant='outlined'
            margin='dense'
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderContactInfo = () => (
    <Box>
      <Typography variant='h5' className={classes.sectionTitle}>
        {i18n.t('leads.tabs.contact')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.contact')}</InputLabel>
            <Select
              value={globalFormData.contactId}
              onChange={(e) =>
                updateGlobalFormData('contactId', e.target.value)
              }
              label={i18n.t('leads.form.contact')}
            >
              {contacts &&
                contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    {contact.name} - {contact.number}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.column')}</InputLabel>
            <Select
              value={globalFormData.columnId}
              onChange={(e) => updateGlobalFormData('columnId', e.target.value)}
              label={i18n.t('leads.form.column')}
            >
              {columns &&
                columns.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    {column.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.assignedTo')}</InputLabel>
            <Select
              value={globalFormData.assignedToId}
              onChange={(e) =>
                updateGlobalFormData('assignedToId', e.target.value)
              }
              label={i18n.t('leads.form.assignedTo')}
            >
              <MenuItem value=''>
                <em>{i18n.t('leads.form.unassigned')}</em>
              </MenuItem>
              {users &&
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFinancialInfo = () => (
    <Box>
      <Typography variant='h5' className={classes.sectionTitle}>
        {i18n.t('leads.tabs.financial')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.expectedValue')}
            value={globalFormData.expectedValue}
            onChange={(e) =>
              updateGlobalFormData('expectedValue', e.target.value)
            }
            type='number'
            variant='outlined'
            margin='dense'
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.currency')}</InputLabel>
            <Select
              value={globalFormData.currencyId}
              onChange={(e) =>
                updateGlobalFormData('currencyId', e.target.value)
              }
              label={i18n.t('leads.form.currency')}
              disabled={currenciesLoading}
            >
              {currenciesLoading ? (
                <MenuItem value='' disabled>
                  Loading currencies...
                </MenuItem>
              ) : currencies.length > 0 ? (
                currencies.map((currency) => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value='' disabled>
                  No currencies available
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.probability')}
            value={globalFormData.probability}
            onChange={(e) =>
              updateGlobalFormData('probability', e.target.value)
            }
            type='number'
            variant='outlined'
            margin='dense'
            inputProps={{ min: 0, max: 100 }}
            helperText={i18n.t('leads.form.probabilityHelper')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.expectedClosingDate')}
            value={globalFormData.expectedClosingDate}
            onChange={(e) =>
              updateGlobalFormData('expectedClosingDate', e.target.value)
            }
            type='date'
            variant='outlined'
            margin='dense'
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderTagsAndCustomFields = () => (
    <Box>
      <Typography variant='h5' className={classes.sectionTitle}>
        {i18n.t('leads.tabs.tags')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h6' gutterBottom>
            {i18n.t('leads.form.tags')}
          </Typography>
          <Box className={classes.chips}>
            {selectedTags &&
              selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                  className={classes.chip}
                />
              ))}
          </Box>
          <FormControl
            fullWidth
            variant='outlined'
            margin='dense'
            className={classes.tagInput}
          >
            <InputLabel>{i18n.t('leads.form.addTag')}</InputLabel>
            <Select
              value=''
              onChange={(e) => handleTagAdd(e.target.value)}
              label={i18n.t('leads.form.addTag')}
            >
              {tags &&
                tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>
                    <Box display='flex' alignItems='center'>
                      <Box
                        width={16}
                        height={16}
                        borderRadius='50%'
                        bgcolor={tag.color}
                        mr={1}
                      />
                      {tag.name}
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' gutterBottom>
            {i18n.t('leads.form.customFields')}
          </Typography>
          {customFields &&
            Object.entries(customFields).map(([key, value]) => (
              <Box key={key} className={classes.customField}>
                <TextField
                  fullWidth
                  label={key}
                  value={value}
                  onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                  variant='outlined'
                  margin='dense'
                  InputProps={{
                    endAdornment: (
                      <Button
                        size='small'
                        onClick={() => handleCustomFieldDelete(key)}
                        color='secondary'
                      >
                        {i18n.t('common.delete')}
                      </Button>
                    ),
                  }}
                />
              </Box>
            ))}
          <Button
            variant='outlined'
            onClick={() => {
              const key = prompt(i18n.t('leads.form.customFieldName'));
              if (key) {
                handleCustomFieldChange(key, '');
              }
            }}
          >
            {i18n.t('leads.form.addCustomField')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderNotes = () => (
    <Box>
      <Typography variant='h5' className={classes.sectionTitle}>
        {i18n.t('leads.tabs.notes')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={i18n.t('leads.form.notes')}
            value={globalFormData.notes}
            onChange={(e) => updateGlobalFormData('notes', e.target.value)}
            variant='outlined'
            margin='dense'
            multiline
            rows={12}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderFinancialInfo();
      case 3:
        return renderTagsAndCustomFields();
      case 4:
        return renderNotes();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xl'
      fullWidth
      classes={{ paper: classes.dialogPaper }}
      className={classes.leadModalDialog}
    >
      <DialogTitle>
        {lead ? i18n.t('leads.dialog.edit') : i18n.t('leads.dialog.new')}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box className={classes.sidebar}>
          <List className={classes.sidebarList}>
            {sections.map((section) => (
              <ListItem
                key={section.id}
                button
                className={
                  activeSection === section.id
                    ? classes.sidebarItemActive
                    : classes.sidebarItem
                }
                onClick={() => setActiveSection(section.id)}
              >
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.label} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box className={classes.content}>
          {loading ? <CircularProgress /> : renderContent()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary' variant='contained'>
          {i18n.t('common.cancel')}
        </Button>
        <Button
          onClick={() => handleSave()}
          color='primary'
          variant='contained'
        >
          {lead ? i18n.t('common.update') : i18n.t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadModal;
