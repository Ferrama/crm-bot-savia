import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
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
}));

const LeadSchema = Yup.object().shape({
  contactId: Yup.number().required('Required'),
  stage: Yup.string().required('Required'),
  temperature: Yup.string().required('Required'),
  source: Yup.string().nullable(),
  expectedValue: Yup.number().nullable(),
  probability: Yup.number().min(0).max(100).nullable(),
  expectedClosingDate: Yup.string().nullable(),
  assignedToId: Yup.number().nullable(),
  notes: Yup.string().nullable(),
  customFields: Yup.object().nullable(),
});

const LeadModal = ({ open, onClose, reload, lead }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [currentContact, setCurrentContact] = useState({
    id: '',
    name: '',
    number: '',
  });

  const initialValues = {
    contactId: '',
    stage: 'new',
    temperature: 'cold',
    source: '',
    expectedValue: '',
    probability: '',
    expectedClosingDate: moment().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
    assignedToId: '',
    notes: '',
    customFields: {},
  };

  useEffect(() => {
    if (lead) {
      initialValues.contactId = lead.contactId;
      initialValues.stage = lead.stage;
      initialValues.temperature = lead.temperature;
      initialValues.source = lead.source || '';
      initialValues.expectedValue = lead.expectedValue || '';
      initialValues.probability = lead.probability || '';
      initialValues.expectedClosingDate = lead.expectedClosingDate
        ? moment(lead.expectedClosingDate).format('YYYY-MM-DDTHH:mm')
        : moment().add(1, 'day').format('YYYY-MM-DDTHH:mm');
      initialValues.assignedToId = lead.assignedToId || '';
      initialValues.notes = lead.notes || '';
      initialValues.customFields = lead.customFields || {};
      const contact = contacts.find((c) => c.id === lead.contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
    loadContacts();
    loadUsers();
  }, [lead]);

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
      const { data } = await api.get('/contacts', {
        params: {
          limit: 999999, // Fetch all contacts
          searchParam: '', // No search filter
        },
      });
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
        expectedValue: values.expectedValue
          ? Number(values.expectedValue)
          : null,
        probability: values.probability ? Number(values.probability) : null,
        assignedToId: values.assignedToId ? Number(values.assignedToId) : null,
        source: values.source || null,
        notes: values.notes || null,
        expectedClosingDate: values.expectedClosingDate || null,
      };

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
        enableReinitialize
        initialValues={initialValues}
        validationSchema={LeadSchema}
        onSubmit={handleSave}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent dividers style={{ maxHeight: '80vh' }}>
              <Grid spacing={2} container>
                <Grid xs={12} item>
                  <FormControl variant='outlined' fullWidth margin='dense'>
                    <Autocomplete
                      fullWidth
                      value={currentContact}
                      options={contacts}
                      loading={loading}
                      onInputChange={(e, value) => {
                        setSearchParam(value);
                        if (!value) {
                          setContacts([]);
                          setPageNumber(1);
                        }
                      }}
                      onChange={(e, contact) => {
                        const contactId = contact ? contact.id : '';
                        setFieldValue('contactId', contactId);
                        setCurrentContact(
                          contact ? contact : { id: '', name: '', number: '' }
                        );
                      }}
                      getOptionLabel={(option) =>
                        option.name ? `${option.name} - ${option.number}` : ''
                      }
                      getOptionSelected={(option, value) =>
                        value.id === option.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label={i18n.t('leads.modal.form.contact')}
                          error={touched.contactId && Boolean(errors.contactId)}
                          helperText={touched.contactId && errors.contactId}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loading ? (
                                  <CircularProgress color='inherit' size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      disabled={!!lead}
                      ListboxProps={{
                        onScroll: (event) => {
                          const listboxNode = event.currentTarget;
                          if (
                            listboxNode.scrollTop + listboxNode.clientHeight >=
                              listboxNode.scrollHeight - 1 &&
                            !loading &&
                            hasMore
                          ) {
                            setPageNumber((prev) => prev + 1);
                          }
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <FormControl fullWidth margin='dense'>
                    <InputLabel>{i18n.t('leads.modal.form.stage')}</InputLabel>
                    <Field as={Select} name='stage'>
                      <MenuItem value='new'>
                        {i18n.t('leads.stages.new')}
                      </MenuItem>
                      <MenuItem value='contacted'>
                        {i18n.t('leads.stages.contacted')}
                      </MenuItem>
                      <MenuItem value='qualified'>
                        {i18n.t('leads.stages.qualified')}
                      </MenuItem>
                      <MenuItem value='proposal'>
                        {i18n.t('leads.stages.proposal')}
                      </MenuItem>
                      <MenuItem value='negotiation'>
                        {i18n.t('leads.stages.negotiation')}
                      </MenuItem>
                      <MenuItem value='closed_won'>
                        {i18n.t('leads.stages.closed_won')}
                      </MenuItem>
                      <MenuItem value='closed_lost'>
                        {i18n.t('leads.stages.closed_lost')}
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <FormControl fullWidth margin='dense'>
                    <InputLabel>
                      {i18n.t('leads.modal.form.temperature')}
                    </InputLabel>
                    <Field as={Select} name='temperature'>
                      <MenuItem value='hot'>
                        {i18n.t('leads.temperatures.hot')}
                      </MenuItem>
                      <MenuItem value='warm'>
                        {i18n.t('leads.temperatures.warm')}
                      </MenuItem>
                      <MenuItem value='cold'>
                        {i18n.t('leads.temperatures.cold')}
                      </MenuItem>
                    </Field>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Field
                    as={TextField}
                    fullWidth
                    margin='dense'
                    label={i18n.t('leads.modal.form.source')}
                    name='source'
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Field
                    as={TextField}
                    fullWidth
                    margin='dense'
                    label={i18n.t('leads.modal.form.expectedValue')}
                    name='expectedValue'
                    type='number'
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Field
                    as={TextField}
                    fullWidth
                    margin='dense'
                    label={i18n.t('leads.modal.form.probability')}
                    name='probability'
                    type='number'
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <Field
                    as={TextField}
                    fullWidth
                    margin='dense'
                    label={i18n.t('leads.modal.form.expectedClosingDate')}
                    name='expectedClosingDate'
                    type='datetime-local'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      touched.expectedClosingDate &&
                      Boolean(errors.expectedClosingDate)
                    }
                    helperText={
                      touched.expectedClosingDate && errors.expectedClosingDate
                    }
                    variant='outlined'
                  />
                </Grid>

                <Grid xs={12} item>
                  <FormControl fullWidth margin='dense'>
                    <InputLabel>
                      {i18n.t('leads.modal.form.assignedTo')}
                    </InputLabel>
                    <Field as={Select} name='assignedToId'>
                      <MenuItem value=''>
                        <em>{i18n.t('leads.modal.form.selectUser')}</em>
                      </MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                <Grid xs={12} item>
                  <Field
                    as={TextField}
                    fullWidth
                    margin='dense'
                    label={i18n.t('leads.modal.form.notes')}
                    name='notes'
                    multiline
                    rows={4}
                  />
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
  );
};

export default LeadModal;
