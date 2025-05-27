import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import toastError from '../../errors/toastError';
import useAuth from '../../hooks/useAuth.js';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  multFieldLine: {
    display: 'flex',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  dialogPaper: {
    minWidth: '600px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  chip: {
    margin: 2,
  },
}));

const LeadSchema = Yup.object().shape({
  name: Yup.string().required(i18n.t('leads.validation.name.required')),
  contactId: Yup.number().required(i18n.t('leads.validation.contact.required')),
  columnId: Yup.number().required(i18n.t('leads.validation.column.required')),
  temperature: Yup.string().required(
    i18n.t('leads.validation.temperature.required')
  ),
  source: Yup.string().required(i18n.t('leads.validation.source.required')),
  currencyId: Yup.number().required(
    i18n.t('leads.validation.currency.required')
  ),
  expectedValue: Yup.number().nullable(),
  probability: Yup.number()
    .min(0, i18n.t('leads.validation.probability.min'))
    .max(100, i18n.t('leads.validation.probability.max'))
    .nullable(),
  expectedClosingDate: Yup.date().nullable(),
  assignedToId: Yup.number().nullable(),
});

const LeadModal = ({ open, onClose, reload, lead, columnId }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tags, setTags] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [currentContact, setCurrentContact] = useState({
    id: '',
    name: '',
    number: '',
  });

  const initialValues = {
    name: lead?.name || '',
    contactId: lead?.contactId || '',
    columnId: lead?.columnId || columnId || '',
    temperature: lead?.temperature || 'cold',
    source: lead?.source || '',
    expectedValue: lead?.expectedValue || '',
    currencyId: lead?.currencyId || 1, // USD por defecto
    probability: lead?.probability || '',
    expectedClosingDate: lead?.expectedClosingDate || '',
    assignedToId: lead?.assignedToId || '',
  };

  useEffect(() => {
    if (open) {
      loadContacts();
      loadUsers();
      loadColumns();
      loadTags();
      loadCurrencies();
      if (lead) {
        setCurrentContact({
          id: lead.contact.id,
          name: lead.contact.name,
          number: lead.contact.number,
        });
        setSelectedTags(lead.tags || []);
      } else {
        setCurrentContact({
          id: '',
          name: '',
          number: '',
        });
        setSelectedTags([]);
      }
    }
  }, [open, lead]);

  useEffect(() => {
    setContacts([]);
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await api.get('/contacts/', {
          params: { searchParam, pageNumber },
        });
        setContacts((prevContacts) => {
          const newContacts = data.contacts.filter(
            (contact) => !prevContacts.some((c) => c.id === contact.id)
          );
          return [...prevContacts, ...newContacts];
        });
        setHasMore(data.hasMore);
        setLoading(false);
      } catch (err) {
        toastError(err);
      }
    };
    fetchContacts();
  }, [searchParam, pageNumber]);

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data.contacts);
    } catch (err) {
      toastError(err);
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (err) {
      toastError(err);
    }
  };

  const loadColumns = async () => {
    try {
      const { data } = await api.get('/lead-columns');
      setColumns(data);
    } catch (err) {
      toastError(err);
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await api.get('/tags');
      setTags(data.tags);
    } catch (err) {
      toastError(err);
    }
  };

  const loadCurrencies = async () => {
    try {
      const { data } = await api.get('/currencies');
      setCurrencies(data);
    } catch (err) {
      toastError(err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      if (!currentContact || !currentContact.id) {
        toast.error(i18n.t('leads.toasts.contactRequired'));
        setLoading(false);
        setSubmitting(false);
        return;
      }

      const processedValues = {
        ...values,
        contactId: Number(values.contactId),
        name: currentContact.name,
        columnId: Number(values.columnId),
        temperature: values.temperature,
        source: values.source,
        currencyId: Number(values.currencyId),
        tagIds: selectedTags.map((tag) => tag.id),
      };

      if (values.expectedValue !== '') {
        processedValues.expectedValue = Number(values.expectedValue);
      }
      if (values.probability !== '') {
        processedValues.probability = Number(values.probability);
      }
      if (
        values.expectedClosingDate &&
        values.expectedClosingDate.trim() !== ''
      ) {
        processedValues.expectedClosingDate = values.expectedClosingDate;
      }
      if (
        values.assignedToId &&
        values.assignedToId !== '' &&
        !isNaN(Number(values.assignedToId))
      ) {
        processedValues.assignedToId = Number(values.assignedToId);
      } else {
        processedValues.assignedToId = null;
      }

      if (lead) {
        await api.put(`/leads/${lead.id}`, processedValues);
        toast.success(i18n.t('leads.toasts.updated'));
      } else {
        await api.post('/leads', processedValues);
        toast.success(i18n.t('leads.toasts.created'));
      }
      handleClose();
      reload();
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='md'
        fullWidth
        scroll='paper'
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>
          {lead
            ? i18n.t('leads.modal.edit.title')
            : i18n.t('leads.modal.add.title')}
        </DialogTitle>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={LeadSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSave(values, actions);
            }, 400);
          }}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
          }) => (
            <Form>
              <DialogContent dividers style={{ maxHeight: '80vh' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='name'
                      label={i18n.t('leads.modal.form.name')}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={touched.contactId && Boolean(errors.contactId)}
                      variant='outlined'
                    >
                      <InputLabel>
                        {i18n.t('leads.modal.form.contact')}
                      </InputLabel>
                      <Select
                        name='contactId'
                        value={values.contactId}
                        onChange={(e) => {
                          handleChange(e);
                          const selectedContact = contacts.find(
                            (contact) => contact.id === e.target.value
                          );
                          if (selectedContact) {
                            setCurrentContact({
                              id: selectedContact.id,
                              name: selectedContact.name,
                              number: selectedContact.number,
                            });
                          }
                        }}
                        onBlur={handleBlur}
                        label={i18n.t('leads.modal.form.contact')}
                      >
                        {contacts.map((contact) => (
                          <MenuItem key={contact.id} value={contact.id}>
                            {contact.name} - {contact.number}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.contactId && errors.contactId && (
                        <FormHelperText>{errors.contactId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={touched.columnId && Boolean(errors.columnId)}
                      variant='outlined'
                    >
                      <InputLabel>
                        {i18n.t('leads.modal.form.column')}
                      </InputLabel>
                      <Select
                        name='columnId'
                        value={values.columnId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={i18n.t('leads.modal.form.column')}
                      >
                        {columns.map((column) => (
                          <MenuItem key={column.id} value={column.id}>
                            {column.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.columnId && errors.columnId && (
                        <FormHelperText>{errors.columnId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      error={touched.temperature && Boolean(errors.temperature)}
                      variant='outlined'
                    >
                      <InputLabel>
                        {i18n.t('leads.modal.form.temperature')}
                      </InputLabel>
                      <Select
                        name='temperature'
                        value={values.temperature}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={i18n.t('leads.modal.form.temperature')}
                      >
                        <MenuItem value='hot'>
                          {i18n.t('leads.temperatures.hot')}
                        </MenuItem>
                        <MenuItem value='warm'>
                          {i18n.t('leads.temperatures.warm')}
                        </MenuItem>
                        <MenuItem value='cold'>
                          {i18n.t('leads.temperatures.cold')}
                        </MenuItem>
                      </Select>
                      {touched.temperature && errors.temperature && (
                        <FormHelperText>{errors.temperature}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='source'
                      label={i18n.t('leads.modal.form.source')}
                      error={touched.source && Boolean(errors.source)}
                      helperText={touched.source && errors.source}
                      value={values.source}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          name='expectedValue'
                          label={i18n.t('leads.modal.form.expectedValue')}
                          type='number'
                          error={
                            touched.expectedValue &&
                            Boolean(errors.expectedValue)
                          }
                          helperText={
                            touched.expectedValue && errors.expectedValue
                          }
                          value={values.expectedValue || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variant='outlined'
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          fullWidth
                          error={
                            touched.currencyId && Boolean(errors.currencyId)
                          }
                          variant='outlined'
                        >
                          <InputLabel>
                            {i18n.t('leads.modal.form.currency')}
                          </InputLabel>
                          <Select
                            name='currencyId'
                            value={values.currencyId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={i18n.t('leads.modal.form.currency')}
                          >
                            {currencies.map((currency) => (
                              <MenuItem key={currency.id} value={currency.id}>
                                {currency.code} - {currency.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.currencyId && errors.currencyId && (
                            <FormHelperText>{errors.currencyId}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name='probability'
                      label={i18n.t('leads.modal.form.probability')}
                      type='number'
                      error={touched.probability && Boolean(errors.probability)}
                      helperText={touched.probability && errors.probability}
                      value={values.probability || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name='expectedClosingDate'
                      label={i18n.t('leads.modal.form.expectedClosingDate')}
                      type='date'
                      error={
                        touched.expectedClosingDate &&
                        Boolean(errors.expectedClosingDate)
                      }
                      helperText={
                        touched.expectedClosingDate &&
                        errors.expectedClosingDate
                      }
                      value={values.expectedClosingDate || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant='outlined'
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={
                        touched.assignedToId && Boolean(errors.assignedToId)
                      }
                      variant='outlined'
                    >
                      <InputLabel>
                        {i18n.t('leads.modal.form.assignedTo')}
                      </InputLabel>
                      <Select
                        name='assignedToId'
                        value={values.assignedToId || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={i18n.t('leads.modal.form.assignedTo')}
                      >
                        <MenuItem value=''>
                          <em>{i18n.t('leads.modal.form.none')}</em>
                        </MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.assignedToId && errors.assignedToId && (
                        <FormHelperText>{errors.assignedToId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant='outlined'>
                      <InputLabel>{i18n.t('leads.modal.form.tags')}</InputLabel>
                      <Select
                        multiple
                        value={selectedTags}
                        onChange={(event) => {
                          setSelectedTags(event.target.value);
                        }}
                        renderValue={(selected) => (
                          <Box className={classes.chips}>
                            {selected.map((tag) => (
                              <Chip
                                key={tag.id}
                                label={tag.name}
                                className={classes.chip}
                                style={{ backgroundColor: tag.color || '#ccc' }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {tags.map((tag) => (
                          <MenuItem key={tag.id} value={tag}>
                            {tag.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color='secondary'
                  disabled={loading}
                >
                  {i18n.t('leads.buttons.cancel')}
                </Button>
                <Button
                  type='submit'
                  color='primary'
                  variant='contained'
                  disabled={loading || isSubmitting}
                >
                  {i18n.t('leads.buttons.save')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default LeadModal;
