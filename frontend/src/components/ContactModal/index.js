import React, { useEffect, useState } from 'react';

import { Field, FieldArray, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Trash2 } from 'lucide-react';

import { i18n } from '../../translate/i18n';

import ButtonWithSpinner from '../../components/ButtonWithSpinner';
import toastError from '../../errors/toastError';
import useSettings from '../../hooks/useSettings';
import api from '../../services/api';
import { TagsContainer } from '../TagsContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },

  extraAttr: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
}));

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  number: Yup.string().min(8, 'Too Short!').max(50, 'Too Long!'),
  email: Yup.string().email('Invalid email'),
});

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
  const classes = useStyles();
  const { getSetting } = useSettings();

  const initialState = {
    name: '',
    number: '',
    email: '',
    disableBot: false,
  };

  const [contact, setContact] = useState(initialState);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    getSetting('tagsMode').then((res) => {
      setShowTags(['contact', 'both'].includes(res));
    });

    const fetchContact = async () => {
      if (initialValues) {
        setContact((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contacts/${contactId}`);
        setContact(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setContact(initialState);
  };

  const handleSaveContact = async (values) => {
    try {
      if (contactId) {
        await api.put(`/contacts/${contactId}`, values);
        handleClose();
      } else {
        const { data } = await api.post('/contacts', values);
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t('contactModal.success'));
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth='lg' scroll='paper'>
        <DialogTitle id='form-dialog-title'>
          {contactId
            ? `${i18n.t('contactModal.title.edit')}`
            : `${i18n.t('contactModal.title.add')}`}
        </DialogTitle>
        <Formik
          initialValues={contact}
          enableReinitialize={true}
          validationSchema={ContactSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveContact(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Typography variant='subtitle1' gutterBottom>
                  {i18n.t('contactModal.form.mainInfo')}
                </Typography>
                <Field
                  as={TextField}
                  label={i18n.t('contactModal.form.name')}
                  name='name'
                  autoFocus
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant='outlined'
                  margin='dense'
                  className={classes.textField}
                />
                <Field
                  as={TextField}
                  label={i18n.t('contactModal.form.number')}
                  name='number'
                  error={touched.number && Boolean(errors.number)}
                  helperText={touched.number && errors.number}
                  placeholder='54113456789'
                  variant='outlined'
                  margin='dense'
                />
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('contactModal.form.email')}
                    name='email'
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    placeholder='Email address'
                    fullWidth
                    margin='dense'
                    variant='outlined'
                  />
                </div>
                <>
                  <FormControlLabel
                    label={i18n.t('contactModal.form.disableBot')}
                    labelPlacement='start'
                    control={
                      <Switch
                        size='small'
                        checked={values.disableBot}
                        onChange={() =>
                          setContact({
                            ...values,
                            disableBot: !values.disableBot,
                          })
                        }
                        name='disableBot'
                        color='primary'
                      />
                    }
                  />
                </>
                {showTags && <TagsContainer contact={contact} />}
                <Typography
                  style={{ marginBottom: 8, marginTop: 12 }}
                  variant='subtitle1'
                >
                  {i18n.t('contactModal.form.extraInfo')}
                </Typography>

                <FieldArray name='extraInfo'>
                  {({ push, remove }) => (
                    <>
                      {values.extraInfo &&
                        values.extraInfo.length > 0 &&
                        values.extraInfo.map((info, index) => (
                          <div
                            className={classes.extraAttr}
                            key={`${index}-info`}
                          >
                            <Field
                              as={TextField}
                              label={i18n.t('contactModal.form.extraName')}
                              name={`extraInfo[${index}].name`}
                              variant='outlined'
                              margin='dense'
                              className={classes.textField}
                            />
                            <Field
                              as={TextField}
                              label={i18n.t('contactModal.form.extraValue')}
                              name={`extraInfo[${index}].value`}
                              variant='outlined'
                              margin='dense'
                              className={classes.textField}
                            />
                            <IconButton
                              size='small'
                              onClick={() => remove(index)}
                            >
                              <Trash2 />
                            </IconButton>
                          </div>
                        ))}
                      <div className={classes.extraAttr}>
                        <Button
                          style={{ flex: 1, marginTop: 8 }}
                          variant='outlined'
                          color='primary'
                          onClick={() => push({ name: '', value: '' })}
                        >
                          {`+ ${i18n.t('contactModal.buttons.addExtraInfo')}`}
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color='secondary'
                  variant='contained'
                  autoFocus
                >
                  {i18n.t('contactModal.buttons.cancel')}
                </Button>
                <ButtonWithSpinner
                  loading={isSubmitting}
                  color='primary'
                  type='submit'
                  variant='contained'
                  autoFocus
                >
                  {contactId
                    ? i18n.t('contactModal.buttons.okEdit')
                    : i18n.t('contactModal.buttons.okAdd')}
                </ButtonWithSpinner>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ContactModal;
