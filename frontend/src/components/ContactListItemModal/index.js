import React, { useContext, useEffect, useRef, useState } from 'react';

import { Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { i18n } from '../../translate/i18n';

import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';

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

const ContactListItemModal = ({
  open,
  onClose,
  contactId,
  initialValues,
  onSave,
}) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const {
    user: { companyId },
  } = useContext(AuthContext);
  const { contactListId } = useParams();

  const initialState = {
    name: '',
    number: '',
    email: '',
  };

  const [contact, setContact] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      if (initialValues) {
        setContact((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contact-list-items/${contactId}`);
        if (isMounted.current) {
          setContact(data);
        }
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
        await api.put(`/contact-list-items/${contactId}`, {
          ...values,
          companyId,
          contactListId,
        });
        handleClose();
      } else {
        const { data } = await api.post('/contact-list-items', {
          ...values,
          companyId,
          contactListId,
        });
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
      <Dialog open={open} onClose={handleClose} maxWidth='sm' scroll='paper'>
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
                <Grid container spacing={1} direction='row'>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label={i18n.t('contactModal.form.name')}
                      name='name'
                      autoFocus
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant='outlined'
                      margin='dense'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label={i18n.t('contactModal.form.number')}
                      name='number'
                      error={touched.number && Boolean(errors.number)}
                      helperText={touched.number && errors.number}
                      placeholder='54113456789'
                      variant='outlined'
                      margin='dense'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color='secondary'
                  disabled={isSubmitting}
                  variant='contained'
                >
                  {i18n.t('contactModal.buttons.cancel')}
                </Button>
                <Button
                  type='submit'
                  color='primary'
                  disabled={isSubmitting}
                  variant='contained'
                  className={classes.btnWrapper}
                >
                  {contactId
                    ? `${i18n.t('contactModal.buttons.okEdit')}`
                    : `${i18n.t('contactModal.buttons.okAdd')}`}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default ContactListItemModal;
