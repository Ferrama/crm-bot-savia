import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import { Copy } from 'lucide-react';

import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import ButtonWithSpinner from '../ButtonWithSpinner';
import QueueSelect from '../QueueSelect';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  multFieldLine: {
    display: 'flex',
    flexDirection: 'column',
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
}));

const SessionSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const WhatsAppModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const initialState = {
    name: '',
    greetingMessage: '',
    complationMessage: '',
    outOfHoursMessage: '',
    ratingMessage: '',
    transferMessage: '',
    isDefault: false,
    token: uuidv4(),
    provider: 'beta',
  };
  const [whatsApp, setWhatsApp] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`whatsapp/${whatsAppId}?session=0`);
        setWhatsApp(data);

        const whatsQueueIds = data.queues?.map((queue) => queue.id);
        setSelectedQueueIds(whatsQueueIds);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  const handleSaveWhatsApp = async (values) => {
    const whatsappData = { ...values, queueIds: selectedQueueIds };
    delete whatsappData['queues'];
    delete whatsappData['session'];

    try {
      if (whatsAppId) {
        await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
      } else {
        await api.post('/whatsapp', whatsappData);
      }
      toast.success(i18n.t('whatsappModal.success'));
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(whatsApp.token);
    toast.success(i18n.t('whatsappModal.token.copied'));
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
        scroll='paper'
        showCloseIcon={true}
      >
        <DialogTitle>
          {whatsAppId
            ? i18n.t('whatsappModal.title.edit')
            : i18n.t('whatsappModal.title.add')}
        </DialogTitle>
        <Formik
          initialValues={whatsApp}
          enableReinitialize={true}
          validationSchema={SessionSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveWhatsApp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid spacing={4} container style={{ flexDirection: 'column' }}>
                  <Grid item style={{ padding: '16px 16px 0px 16px' }}>
                    <Field
                      as={TextField}
                      label={i18n.t('whatsappModal.form.name')}
                      autoFocus
                      name='name'
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant='outlined'
                      margin='dense'
                      className={classes.textField}
                      fullWidth
                    />
                  </Grid>

                  <Grid style={{ padding: '8px 16px 16px 16px' }} item>
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          color='primary'
                          name='isDefault'
                          checked={values.isDefault}
                        />
                      }
                      label={i18n.t('whatsappModal.form.default')}
                      style={{ gap: 8 }}
                    />
                  </Grid>
                </Grid>

                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.greetingMessage')}
                    type='greetingMessage'
                    multiline
                    rows={4}
                    fullWidth
                    name='greetingMessage'
                    spellCheck={true}
                    error={
                      touched.greetingMessage && Boolean(errors.greetingMessage)
                    }
                    helperText={
                      touched.greetingMessage && errors.greetingMessage
                    }
                    variant='outlined'
                    margin='dense'
                  />
                </div>
                <div>
                  <Typography style={{ fontSize: '11px' }}>
                    {`Variaveis: ( {{ms}}=> Turno, 
                  {{name}}=> Nome do contato, 
                  {{protocol}}=> protocolo, {{hora}}=> hora )`}
                  </Typography>
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.complationMessage')}
                    type='complationMessage'
                    multiline
                    rows={4}
                    fullWidth
                    name='complationMessage'
                    spellCheck={true}
                    error={
                      touched.complationMessage &&
                      Boolean(errors.complationMessage)
                    }
                    helperText={
                      touched.complationMessage && errors.complationMessage
                    }
                    variant='outlined'
                    margin='dense'
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.transferMessage')}
                    type='transferMessage'
                    multiline
                    rows={4}
                    fullWidth
                    name='transferMessage'
                    spellCheck={true}
                    error={
                      touched.transferMessage && Boolean(errors.transferMessage)
                    }
                    helperText={
                      touched.transferMessage && errors.transferMessage
                    }
                    variant='outlined'
                    margin='dense'
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.outOfHoursMessage')}
                    type='outOfHoursMessage'
                    multiline
                    rows={4}
                    fullWidth
                    name='outOfHoursMessage'
                    spellCheck={true}
                    error={
                      touched.outOfHoursMessage &&
                      Boolean(errors.outOfHoursMessage)
                    }
                    helperText={
                      touched.outOfHoursMessage && errors.outOfHoursMessage
                    }
                    variant='outlined'
                    margin='dense'
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.ratingMessage')}
                    type='ratingMessage'
                    multiline
                    rows={4}
                    fullWidth
                    name='ratingMessage'
                    spellCheck={true}
                    error={
                      touched.ratingMessage && Boolean(errors.ratingMessage)
                    }
                    helperText={touched.ratingMessage && errors.ratingMessage}
                    variant='outlined'
                    margin='dense'
                  />
                </div>
                <div>
                  <Field
                    as={TextField}
                    label={i18n.t('queueModal.form.token')}
                    type='text'
                    fullWidth
                    name='token'
                    variant='outlined'
                    margin='dense'
                    disabled={true}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleCopyToken}
                            edge='end'
                            aria-label='copy token'
                            size='small'
                          >
                            <Copy size={18} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <QueueSelect
                  selectedQueueIds={selectedQueueIds}
                  onChange={(selectedIds) => setSelectedQueueIds(selectedIds)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color='secondary'
                  variant='contained'
                  autoFocus
                >
                  {i18n.t('whatsappModal.buttons.cancel')}
                </Button>
                <ButtonWithSpinner
                  loading={isSubmitting}
                  color='primary'
                  type='submit'
                  variant='contained'
                  autoFocus
                >
                  {whatsAppId
                    ? i18n.t('whatsappModal.buttons.okEdit')
                    : i18n.t('whatsappModal.buttons.okAdd')}
                </ButtonWithSpinner>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default React.memo(WhatsAppModal);
