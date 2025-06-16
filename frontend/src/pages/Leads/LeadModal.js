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
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  DollarSign,
  FileText,
  Info,
  Palette,
  Plus,
  Tag,
  User,
  X,
} from 'lucide-react';
import { ColorBox } from 'material-ui-color';
import moment from 'moment';
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
  newTagForm: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
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
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', color: '#1976d2' });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // Estados para búsqueda y paginación de contactos
  const [searchParam, setSearchParam] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreContacts, setHasMoreContacts] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

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

  // Campos requeridos por sección
  const requiredFieldsBySection = [
    // Sección 0: Básico
    ['name'],
    // Sección 1: Contacto
    ['contactId', 'columnId'],
    // Sección 2: Financiero
    ['currencyId'],
    // Sección 3: Tags y custom fields (ningún campo requerido)
    [],
    // Sección 4: Notas (ningún campo requerido)
    [],
  ];

  // Validación de campos requeridos para la sección actual
  const isSectionValid = () => {
    const required = requiredFieldsBySection[activeSection];
    return required.every((field) => {
      const value = globalFormData[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  // Navegación entre secciones
  const handleNext = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (activeSection > 0) {
      setActiveSection((prev) => prev - 1);
    }
  };

  // Mapeo de estados a códigos de columna
  const statusToColumnCode = {
    new: 'new',
    contacted: 'contacted',
    follow_up: 'follow_up',
    proposal: 'proposal',
    negotiation: 'negotiation',
    qualified: 'qualified',
    unqualified: 'not_qualified',
    converted: 'converted',
    lost: 'lost',
    closed_won: 'closed_won',
    closed_lost: 'closed_lost',
  };

  // Función para encontrar la columna por código
  const findColumnByCode = (code) => {
    return columns.find((column) => column.code === code);
  };

  // Función para actualizar la columna basada en el estado
  const updateColumnFromStatus = (status) => {
    const columnCode = statusToColumnCode[status];
    if (columnCode) {
      const correspondingColumn = findColumnByCode(columnCode);
      if (correspondingColumn) {
        updateGlobalFormData('columnId', correspondingColumn.id);
      }
    }
  };

  useEffect(() => {
    if (open && !dataLoaded) {
      setLoading(true);
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
          : moment().add(5, 'days').format('YYYY-MM-DD'),
        assignedToId: lead?.assignedToId || '',
        notes: lead?.notes || '',
      };
      setGlobalFormData(initialData);
      setPageNumber(1);
      Promise.all([
        loadContacts('', 1),
        loadUsers(),
        loadColumns(),
        loadTags(),
        loadCurrencies(),
      ])
        .then(() => {
          if (lead) {
            setSelectedTags(
              (lead.tagRelations || []).map((tag) => ({
                id: tag.id,
                name: tag.name,
                color: tag.color,
              }))
            );
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

  // Actualizar el formulario cuando el lead cambie (para modo edición)
  useEffect(() => {
    if (open && dataLoaded && lead) {
      const updatedData = {
        name: lead.name || '',
        title: lead.title || '',
        description: lead.description || '',
        contactId: lead.contactId || '',
        columnId: lead.columnId || columnId || '',
        temperature: lead.temperature || 'warm',
        status: lead.status || 'new',
        pipeline: lead.pipeline || 'default',
        source: lead.source || '',
        currencyId: lead.currencyId || '',
        probability: lead.probability || 50,
        expectedValue: lead.expectedValue || '',
        expectedClosingDate: lead.expectedClosingDate
          ? lead.expectedClosingDate.split('T')[0]
          : moment().add(5, 'days').format('YYYY-MM-DD'),
        assignedToId: lead.assignedToId || '',
        notes: lead.notes || '',
      };
      setGlobalFormData(updatedData);
      setSelectedTags(
        (lead.tagRelations || []).map((tag) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }))
      );
      setCustomFields(lead.customFields || {});
    }
  }, [lead, open, dataLoaded, columnId]);

  useEffect(() => {
    if (open && dataLoaded) {
      setPageNumber(1);
      loadContacts(searchParam, 1);
    }
    // eslint-disable-next-line
  }, [searchParam]);

  const loadContacts = async (search = '', page = 1) => {
    setLoadingContacts(true);
    try {
      const { data } = await api.get('/contacts', {
        params: { searchParam: search, pageNumber: page },
      });
      if (page === 1) {
        setContacts(data.contacts || []);
      } else {
        setContacts((prev) => [...prev, ...(data.contacts || [])]);
      }
      setHasMoreContacts(data.hasMore);
    } catch (err) {
      console.error('Error loading contacts:', err);
      if (page === 1) setContacts([]);
      setHasMoreContacts(false);
    } finally {
      setLoadingContacts(false);
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
      // Try different possible endpoints
      let currenciesData = [];

      try {
        const { data } = await api.get('/currencies');

        currenciesData = data.currencies || data || [];
      } catch (firstError) {
        try {
          const { data } = await api.get('/currency');

          currenciesData = data.currencies || data || [];
        } catch (secondError) {
          try {
            const { data } = await api.get('/settings/currencies');

            currenciesData = data.currencies || data || [];
          } catch (thirdError) {
            console.error('All currency endpoints failed');
            throw thirdError;
          }
        }
      }

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
    setGlobalFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Si se está actualizando el status, actualizar automáticamente la columna
      if (field === 'status' && value) {
        const columnCode = statusToColumnCode[value];
        if (columnCode) {
          const correspondingColumn = findColumnByCode(columnCode);
          if (correspondingColumn) {
            newData.columnId = correspondingColumn.id;
          }
        }
      }

      return newData;
    });
  };

  const handleSave = async () => {
    try {
      // Limpiar campos numéricos opcionales y setear expectedClosingDate si está vacío
      let expectedClosingDate = globalFormData.expectedClosingDate;
      if (!expectedClosingDate) {
        expectedClosingDate = moment().add(5, 'days').format('YYYY-MM-DD');
      }
      const leadData = {
        ...globalFormData,
        tagIds: selectedTags.map((tag) => tag.id),
        customFields,
        assignedToId:
          globalFormData.assignedToId === '' ||
          globalFormData.assignedToId === undefined
            ? undefined
            : Number(globalFormData.assignedToId),
        expectedValue:
          globalFormData.expectedValue === '' ||
          globalFormData.expectedValue === undefined
            ? undefined
            : Number(globalFormData.expectedValue),
        probability:
          globalFormData.probability === '' ||
          globalFormData.probability === undefined
            ? undefined
            : Number(globalFormData.probability),
        expectedClosingDate,
      };

      // Eliminar claves con valor undefined
      Object.keys(leadData).forEach(
        (key) => leadData[key] === undefined && delete leadData[key]
      );

      let response;
      if (lead) {
        response = await api.put(`/leads/${lead.id}`, leadData);
        toast.success(i18n.t('leads.toasts.updated'));

        // Crear un objeto lead actualizado con los datos de la respuesta
        const updatedLead = {
          ...response.data,
          tagRelations: selectedTags,
          customFields: customFields,
        };

        // Llamar a reload con el lead actualizado
        reload(updatedLead);
      } else {
        response = await api.post('/leads', leadData);
        toast.success(i18n.t('leads.toasts.created'));
        reload();
      }

      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving lead');
    }
  };

  const handleTagAdd = (tagName) => {
    if (tagName) {
      // Buscar el tag completo en la lista de tags disponibles
      const tagObject = tags.find((tag) => tag.name === tagName);
      if (tagObject && !selectedTags.some((tag) => tag.id === tagObject.id)) {
        setSelectedTags([...selectedTags, tagObject]);
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToDelete.id));
  };

  const handleCreateNewTag = async () => {
    if (!newTag.name.trim()) {
      toast.error(i18n.t('leads.toasts.tagNameRequired'));
      return;
    }

    if (newTag.name.length < 3) {
      toast.error(i18n.t('leads.toasts.tagNameMinLength'));
      return;
    }

    try {
      const { data } = await api.post('/tags', {
        name: newTag.name.trim(),
        color: newTag.color,
        kanban: 0,
      });

      // Agregar el nuevo tag a la lista de tags disponibles
      setTags((prevTags) => [...prevTags, data]);

      // Agregar el nuevo tag a los tags seleccionados
      setSelectedTags((prev) => [...prev, data]);

      // Limpiar el formulario
      setNewTag({ name: '', color: '#1976d2' });
      setShowNewTagForm(false);
      setColorPickerOpen(false);

      toast.success(i18n.t('leads.toasts.tagCreated'));
    } catch (err) {
      toast.error(
        err.response?.data?.error || i18n.t('leads.toasts.tagCreationError')
      );
    }
  };

  const handleCancelNewTag = () => {
    setNewTag({ name: '', color: '#1976d2' });
    setShowNewTagForm(false);
    setColorPickerOpen(false);
  };

  const handleCustomFieldChange = (key, value) => {
    setCustomFields({ ...customFields, [key]: value });
  };

  // Función para cargar más contactos al scrollear
  const handleContactScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      hasMoreContacts &&
      !loadingContacts &&
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 100
    ) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      loadContacts(searchParam, nextPage);
    }
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
            <Autocomplete
              fullWidth
              options={contacts}
              value={
                contacts.find((c) => c.id === globalFormData.contactId) || null
              }
              onChange={(e, contact) => {
                updateGlobalFormData('contactId', contact ? contact.id : '');
              }}
              getOptionLabel={(option) =>
                option.name
                  ? `${option.name}${
                      option.number ? ' - ' + option.number : ''
                    }`
                  : ''
              }
              getOptionSelected={(option, value) => option.id === value.id}
              loading={loadingContacts}
              onInputChange={(event, value, reason) => {
                if (reason === 'input') {
                  setSearchParam(value);
                }
              }}
              ListboxProps={{ onScroll: handleContactScroll }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  margin='dense'
                  label={i18n.t('leads.form.contact')}
                  placeholder={i18n.t('scheduleModal.form.contactPlaceholder')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingContacts ? (
                          <CircularProgress color='inherit' size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
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
                columns.map((column) => {
                  const isAutoSelected =
                    statusToColumnCode[globalFormData.status] === column.code;
                  return (
                    <MenuItem key={column.id} value={column.id}>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        width='100%'
                      >
                        <span>
                          {column.code
                            ? i18n.t(`leads.columnCodes.${column.code}`)
                            : column.name}
                        </span>
                        {isAutoSelected && (
                          <Chip
                            label='Auto'
                            size='small'
                            style={{
                              backgroundColor: '#4caf50',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 18,
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  );
                })}
            </Select>
            {globalFormData.status &&
              statusToColumnCode[globalFormData.status] && (
                <Typography
                  variant='caption'
                  color='textSecondary'
                  style={{ marginTop: 4, display: 'block' }}
                >
                  💡 La columna se actualiza automáticamente según el estado
                  seleccionado
                </Typography>
              )}
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
                  key={tag.id}
                  label={tag.name}
                  onDelete={() => handleTagDelete(tag)}
                  className={classes.chip}
                  style={{
                    backgroundColor: tag.color,
                    color: '#fff',
                  }}
                />
              ))}
          </Box>

          {!showNewTagForm ? (
            <Box display='flex' gap={1} alignItems='center' mt={2}>
              <FormControl
                variant='outlined'
                margin='dense'
                style={{ flex: 1 }}
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
              <Button
                variant='outlined'
                startIcon={<Plus />}
                onClick={() => setShowNewTagForm(true)}
                size='small'
              >
                {i18n.t('leads.form.newTag')}
              </Button>
            </Box>
          ) : (
            <Box className={classes.newTagForm}>
              <Typography variant='subtitle2' gutterBottom>
                {i18n.t('leads.form.createNewTag')}
              </Typography>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={i18n.t('leads.form.tagName')}
                    value={newTag.name}
                    onChange={(e) =>
                      setNewTag({ ...newTag, name: e.target.value })
                    }
                    variant='outlined'
                    margin='dense'
                    size='small'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label={i18n.t('leads.form.tagColor')}
                    value={newTag.color}
                    onChange={(e) =>
                      setNewTag({ ...newTag, color: e.target.value })
                    }
                    variant='outlined'
                    margin='dense'
                    size='small'
                    InputProps={{
                      startAdornment: (
                        <Box
                          className={classes.colorPreview}
                          style={{ backgroundColor: newTag.color }}
                        />
                      ),
                      endAdornment: (
                        <Button
                          size='small'
                          onClick={() => setColorPickerOpen(!colorPickerOpen)}
                        >
                          <Palette size={16} />
                        </Button>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box display='flex' gap={1}>
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      onClick={handleCreateNewTag}
                    >
                      {i18n.t('leads.form.createTag')}
                    </Button>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={handleCancelNewTag}
                    >
                      <X size={16} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {colorPickerOpen && (
                <Box mt={2}>
                  <ColorBox
                    disableAlpha={true}
                    hslGradient={false}
                    value={newTag.color}
                    onChange={(val) => {
                      setNewTag({ ...newTag, color: `#${val.hex}` });
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
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
            rows={20}
            inputProps={{
              maxLength: 50000, // 50,000 caracteres máximo
              style: {
                fontSize: '14px',
                lineHeight: '1.5',
                fontFamily: 'monospace',
              },
            }}
            helperText={`${
              globalFormData.notes?.length || 0
            }/50,000 caracteres`}
            placeholder={i18n.t('leads.form.notesPlaceholder')}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2' color='textSecondary' gutterBottom>
            💡 <strong>{i18n.t('leads.form.tourismSuggestions')}</strong>
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            style={{ fontSize: '12px' }}
          >
            {i18n
              .t('leads.form.tourismSuggestionsList')
              .split(', ')
              .map((suggestion, index) => (
                <React.Fragment key={index}>
                  • {suggestion}
                  {index <
                    i18n.t('leads.form.tourismSuggestionsList').split(', ')
                      .length -
                      1 && <br />}
                </React.Fragment>
              ))}
          </Typography>
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
            {sections.map((section, idx) => {
              // En modo edición, permitir navegación libre
              // En modo creación, seguir patrón de validación secuencial
              let disabled = false;

              if (!lead) {
                // Modo creación: solo permitir sección actual, anteriores, o siguiente si la actual es válida
                if (idx > activeSection) {
                  if (idx === activeSection + 1) {
                    disabled = !isSectionValid();
                  } else {
                    disabled = true;
                  }
                }
              }
              // En modo edición (lead existe), todas las secciones están habilitadas

              return (
                <ListItem
                  key={section.id}
                  button
                  disabled={disabled}
                  className={
                    activeSection === section.id
                      ? classes.sidebarItemActive
                      : classes.sidebarItem
                  }
                  onClick={() => {
                    if (!disabled) setActiveSection(section.id);
                  }}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItem>
              );
            })}
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
        {activeSection > 0 && (
          <Button onClick={handlePrev} color='default' variant='outlined'>
            {i18n.t('common.back')}
          </Button>
        )}
        {activeSection < sections.length - 1 ? (
          <Button
            onClick={handleNext}
            color='primary'
            variant='contained'
            disabled={!isSectionValid()}
          >
            {i18n.t('common.next')}
          </Button>
        ) : (
          <Button
            onClick={() => handleSave()}
            color='primary'
            variant='contained'
            disabled={!isSectionValid()}
          >
            {lead ? i18n.t('common.update') : i18n.t('common.create')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LeadModal;
