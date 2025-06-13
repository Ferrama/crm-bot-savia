import React, { useContext, useEffect, useState } from 'react';

import { Field, Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { i18n } from '../../translate/i18n';

import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isArray } from 'lodash';
import moment from 'moment';
import { AuthContext } from '../../context/Auth/AuthContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';

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

  btnWrapper: {
    position: 'relative',
  },

  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const ScheduleSchema = Yup.object().shape({
  body: Yup.string()
    .min(5, i18n.t('scheduleModal.validation.bodyMin'))
    .required(i18n.t('scheduleModal.validation.required')),
  contactId: Yup.number().required(i18n.t('scheduleModal.validation.required')),
  whatsappId: Yup.number().required(
    i18n.t('scheduleModal.validation.required')
  ),
  sendAt: Yup.string()
    .required(i18n.t('scheduleModal.validation.required'))
    .test(
      'min-time',
      i18n.t('scheduleModal.validation.minTime'),
      function (value) {
        if (!value) return false;
        const selectedDate = moment(value);
        const minDate = moment().add(5, 'minutes');
        return selectedDate.isAfter(minDate);
      }
    ),
  saveMessage: Yup.bool(),
});

const ScheduleModal = ({
  open,
  onClose,
  scheduleId,
  contactId,
  cleanContact,
  reload,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const initialState = {
    body: '',
    contactId: '',
    whatsappId: '',
    sendAt: moment().add(5, 'minutes').format('YYYY-MM-DDTHH:mm'),
    sentAt: '',
    saveMessage: false,
    status: 'pending',
  };

  const initialContact = {
    id: '',
    name: '',
  };

  const [schedule, setSchedule] = useState(initialState);
  const [currentContact, setCurrentContact] = useState(initialContact);
  const [contacts, setContacts] = useState([initialContact]);
  const [whatsapps, setWhatsapps] = useState([]);

  useEffect(() => {
    if (contactId && contacts.length) {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) {
        setCurrentContact(contact);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    const { companyId } = user;
    if (open) {
      try {
        (async () => {
          // Load WhatsApp instances
          const { data: whatsappList } = await api.get('/whatsapp/', {
            params: { companyId },
          });
          setWhatsapps(whatsappList);

          const { data: contactList } = await api.get('/contacts/list', {
            params: { companyId: companyId },
          });
          let customList = contactList.map((c) => ({ id: c.id, name: c.name }));
          if (isArray(customList)) {
            setContacts([{ id: '', name: '' }, ...customList]);
          }
          if (contactId) {
            setSchedule((prevState) => {
              return { ...prevState, contactId };
            });
          }

          if (!scheduleId) return;

          const { data } = await api.get(`/schedules/${scheduleId}`);
          setSchedule((prevState) => {
            return {
              ...prevState,
              ...data,
              sendAt: moment(data.sendAt).format('YYYY-MM-DDTHH:mm'),
            };
          });
          setCurrentContact(data.contact);
        })();
      } catch (err) {
        toastError(err);
      }
    }
  }, [scheduleId, contactId, open, user]);

  const handleClose = () => {
    onClose();
    setSchedule(initialState);
  };

  const handleSaveSchedule = async (values) => {
    const scheduleData = { ...values, userId: user.id };
    try {
      if (scheduleId) {
        await api.put(`/schedules/${scheduleId}`, scheduleData);
      } else {
        await api.post('/schedules', scheduleData);
      }
      toast.success(i18n.t('scheduleModal.success'));
      if (typeof reload == 'function') {
        reload();
      }
      if (contactId) {
        if (typeof cleanContact === 'function') {
          cleanContact();
          history.push('/schedules');
        }
      }
    } catch (err) {
      toastError(err);
    }
    setCurrentContact(initialContact);
    setSchedule(initialState);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='xs'
        fullWidth
        scroll='paper'
      >
        <DialogTitle id='form-dialog-title'>
          {schedule.status === 'ERROR'
            ? i18n.t('scheduleModal.title.error')
            : i18n.t('scheduleModal.title.schedule')}
        </DialogTitle>
        <Formik
          initialValues={schedule}
          enableReinitialize={true}
          validationSchema={ScheduleSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSchedule(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <FormControl variant='outlined' fullWidth>
                    <Autocomplete
                      fullWidth
                      value={currentContact}
                      options={contacts}
                      onChange={(e, contact) => {
                        const contactId = contact ? contact.id : '';
                        setSchedule({ ...schedule, contactId });
                        setCurrentContact(contact ? contact : initialContact);
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) => {
                        return value.id === option.id;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          placeholder={i18n.t(
                            'scheduleModal.form.contactPlaceholder'
                          )}
                          error={touched.contactId && Boolean(errors.contactId)}
                          helperText={touched.contactId && errors.contactId}
                        />
                      )}
                    />
                  </FormControl>
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <FormControl variant='outlined' fullWidth>
                    <Field
                      as={Select}
                      name='whatsappId'
                      label={i18n.t('scheduleModal.form.whatsapp')}
                      error={touched.whatsappId && Boolean(errors.whatsappId)}
                      displayEmpty
                    >
                      <MenuItem value='' disabled>
                        {i18n.t('scheduleModal.form.whatsappPlaceholder')}
                      </MenuItem>
                      {whatsapps.map((whatsapp) => (
                        <MenuItem key={whatsapp.id} value={whatsapp.id}>
                          {whatsapp.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.whatsappId && errors.whatsappId && (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '0.75rem',
                          marginTop: '3px',
                        }}
                      >
                        {errors.whatsappId}
                      </div>
                    )}
                  </FormControl>
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    rows={9}
                    multiline={true}
                    label={i18n.t('scheduleModal.form.body')}
                    name='body'
                    error={touched.body && Boolean(errors.body)}
                    helperText={touched.body && errors.body}
                    variant='outlined'
                    margin='dense'
                    fullWidth
                  />
                </div>
                <br />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t('scheduleModal.form.sendAt')}
                    type='datetime-local'
                    name='sendAt'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: moment()
                        .add(5, 'minutes')
                        .format('YYYY-MM-DDTHH:mm'),
                    }}
                    error={touched.sendAt && Boolean(errors.sendAt)}
                    helperText={touched.sendAt && errors.sendAt}
                    variant='outlined'
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <FormControlLabel
                    label={i18n.t('scheduleModal.form.saveMessage')}
                    labelPlacement='end'
                    control={
                      <Switch
                        size='small'
                        checked={values.saveMessage}
                        onChange={() =>
                          setSchedule({
                            ...values,
                            saveMessage: !values.saveMessage,
                          })
                        }
                        name='saveMessage'
                        color='primary'
                      />
                    }
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color='secondary'
                  disabled={isSubmitting}
                  variant='contained'
                >
                  {i18n.t('scheduleModal.buttons.cancel')}
                </Button>
                {(schedule.sentAt === null || schedule.sentAt === '') && (
                  <Button
                    type='submit'
                    color='primary'
                    disabled={
                      isSubmitting ||
                      !values.contactId ||
                      !values.body ||
                      !values.sendAt ||
                      !values.whatsappId ||
                      Object.keys(errors).length > 0
                    }
                    variant='contained'
                    className={classes.btnWrapper}
                  >
                    {scheduleId
                      ? `${i18n.t('scheduleModal.buttons.okEdit')}`
                      : `${i18n.t('scheduleModal.buttons.okAdd')}`}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ScheduleModal;
