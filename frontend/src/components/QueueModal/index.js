import React, { useEffect, useRef, useState } from 'react';

import { Field, Form, Formik } from 'formik';
import { head } from 'lodash';
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
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import { Palette, Paperclip, Trash2 } from 'lucide-react';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import ColorPicker from '../ColorPicker';
import ConfirmationModal from '../ConfirmationModal';
import { QueueOptions } from '../QueueOptions';
import SchedulesForm from '../SchedulesForm';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
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
  colorAdorment: {
    width: 20,
    height: 20,
  },
}));

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  color: Yup.string().min(3, 'Too Short!').max(9, 'Too Long!').required(),
  greetingMessage: Yup.string(),
});

const QueueModal = ({ open, onClose, queueId }) => {
  const classes = useStyles();

  const initialState = {
    name: '',
    color: '',
    greetingMessage: '',
    outOfHoursMessage: '',
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const [tab, setTab] = useState(0);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const greetingRef = useRef();
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);
  const [queueEditable, setQueueEditable] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [schedules, setSchedules] = useState([
    {
      weekday: 'Segunda-feira',
      weekdayEn: 'monday',
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      weekday: 'Terça-feira',
      weekdayEn: 'tuesday',
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      weekday: 'Quarta-feira',
      weekdayEn: 'wednesday',
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      weekday: 'Quinta-feira',
      weekdayEn: 'thursday',
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      weekday: 'Sexta-feira',
      weekdayEn: 'friday',
      startTime: '08:00',
      endTime: '18:00',
    },
    {
      weekday: 'Sábado',
      weekdayEn: 'saturday',
      startTime: '08:00',
      endTime: '12:00',
    },
    {
      weekday: 'Domingo',
      weekdayEn: 'sunday',
      startTime: '00:00',
      endTime: '00:00',
    },
  ]);

  useEffect(() => {
    api.get(`/settings`).then(({ data }) => {
      if (Array.isArray(data)) {
        const scheduleType = data.find((d) => d.key === 'scheduleType');
        if (scheduleType) {
          setSchedulesEnabled(scheduleType.value === 'queue');
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });
        setSchedules(data.schedules);
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue({
        name: '',
        color: '',
        greetingMessage: '',
      });
    };
  }, [queueId, open]);

  const handleClose = () => {
    onClose();
    setQueue(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (queue.mediaPath) {
      await api.delete(`/queue/${queue.id}/media-upload`);
      setQueue((prev) => ({ ...prev, mediaPath: null, mediaName: null }));
      toast.success(i18n.t('queueModal.toasts.deleted'));
    }
  };

  const handleSaveQueue = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...values, schedules });
        if (attachment != null) {
          const formData = new FormData();
          formData.append('file', attachment);
          await api.post(`/queue/${queueId}/media-upload`, formData);
        }
      } else {
        await api.post('/queue', { ...values, schedules });
        if (attachment != null) {
          const formData = new FormData();
          formData.append('file', attachment);
          await api.post(`/queue/${queueId}/media-upload`, formData);
        }
      }
      toast.success('Queue saved successfully');
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveSchedules = async (values) => {
    toast.success('Clique em salvar para registar as alterações');
    setSchedules(values);
    setTab(0);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t('queueModal.confirmationModal.deleteTitle')}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t('queueModal.confirmationModal.deleteMessage')}
      </ConfirmationModal>
      <Dialog
        maxWidth='md'
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll='paper'
      >
        <DialogTitle>
          {queueId
            ? `${i18n.t('queueModal.title.edit')}`
            : `${i18n.t('queueModal.title.add')}`}
          <div style={{ display: 'none' }}>
            <input
              type='file'
              ref={attachmentFile}
              onChange={(e) => handleAttachmentFile(e)}
            />
          </div>
        </DialogTitle>
        <Tabs
          value={tab}
          indicatorColor='primary'
          textColor='primary'
          onChange={(_, v) => setTab(v)}
          aria-label='disabled tabs example'
        >
          <Tab label='Dados da Fila' />
          {schedulesEnabled && <Tab label='Horários de Atendimento' />}
        </Tabs>
        {tab === 0 && (
          <Paper>
            <Formik
              initialValues={queue}
              enableReinitialize={true}
              validationSchema={QueueSchema}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  handleSaveQueue(values);
                  actions.setSubmitting(false);
                }, 400);
              }}
            >
              {({ touched, errors, isSubmitting, values }) => (
                <Form>
                  <DialogContent dividers>
                    <Field
                      as={TextField}
                      label={i18n.t('queueModal.form.name')}
                      autoFocus
                      name='name'
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant='outlined'
                      margin='dense'
                      className={classes.textField}
                    />
                    <Field
                      as={TextField}
                      label={i18n.t('queueModal.form.color')}
                      name='color'
                      id='color'
                      onFocus={() => {
                        setColorPickerModalOpen(true);
                        greetingRef.current.focus();
                      }}
                      error={touched.color && Boolean(errors.color)}
                      helperText={touched.color && errors.color}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <div
                              style={{ backgroundColor: values.color }}
                              className={classes.colorAdorment}
                            ></div>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton
                            size='small'
                            color='default'
                            onClick={() => setColorPickerModalOpen(true)}
                          >
                            <Palette />
                          </IconButton>
                        ),
                      }}
                      variant='outlined'
                      margin='dense'
                      className={classes.textField}
                    />
                    <ColorPicker
                      open={colorPickerModalOpen}
                      handleClose={() => setColorPickerModalOpen(false)}
                      onChange={(color) => {
                        values.color = color;
                        setQueue(() => {
                          return { ...values, color };
                        });
                      }}
                    />
                    <div style={{ marginTop: 5 }}>
                      <Field
                        as={TextField}
                        label={i18n.t('queueModal.form.greetingMessage')}
                        type='greetingMessage'
                        multiline
                        inputRef={greetingRef}
                        rows={5}
                        fullWidth
                        name='greetingMessage'
                        spellCheck={true}
                        error={
                          touched.greetingMessage &&
                          Boolean(errors.greetingMessage)
                        }
                        helperText={
                          touched.greetingMessage && errors.greetingMessage
                        }
                        variant='outlined'
                        margin='dense'
                      />
                      {schedulesEnabled && (
                        <Field
                          as={TextField}
                          InputLabelProps={{ shrink: true }}
                          label={i18n.t('queueModal.form.outOfHoursMessage')}
                          type='outOfHoursMessage'
                          multiline
                          rows={5}
                          fullWidth
                          name='outOfHoursMessage'
                          spellCheck={true}
                          error={
                            touched.outOfHoursMessage &&
                            Boolean(errors.outOfHoursMessage)
                          }
                          helperText={
                            touched.outOfHoursMessage &&
                            errors.outOfHoursMessage
                          }
                          variant='outlined'
                          margin='dense'
                        />
                      )}
                    </div>
                    <QueueOptions queueId={queueId} />
                    {(queue.mediaPath || attachment) && (
                      <Grid xs={12} item>
                        <Button startIcon={<Paperclip />}>
                          {attachment != null
                            ? attachment.name
                            : queue.mediaName}
                        </Button>
                        {queueEditable && (
                          <IconButton
                            onClick={() => setConfirmationOpen(true)}
                            color='secondary'
                          >
                            <Trash2 />
                          </IconButton>
                        )}
                      </Grid>
                    )}
                  </DialogContent>
                  <DialogActions>
                    {!attachment && !queue.mediaPath && queueEditable && (
                      <Button
                        color='primary'
                        onClick={() => attachmentFile.current.click()}
                        disabled={isSubmitting}
                        variant='outlined'
                      >
                        {i18n.t('queueModal.buttons.attach')}
                      </Button>
                    )}
                    <Button
                      onClick={handleClose}
                      color='secondary'
                      disabled={isSubmitting}
                      variant='contained'
                    >
                      {i18n.t('queueModal.buttons.cancel')}
                    </Button>
                    <Button
                      type='submit'
                      color='primary'
                      disabled={isSubmitting}
                      variant='contained'
                      className={classes.btnWrapper}
                    >
                      {queueId
                        ? `${i18n.t('queueModal.buttons.okEdit')}`
                        : `${i18n.t('queueModal.buttons.okAdd')}`}
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
          </Paper>
        )}
        {tab === 1 && (
          <Paper style={{ padding: 20 }}>
            <SchedulesForm
              loading={false}
              onSubmit={handleSaveSchedules}
              initialValues={schedules}
              labelSaveButton='Adicionar'
            />
          </Paper>
        )}
      </Dialog>
    </div>
  );
};

export default QueueModal;
