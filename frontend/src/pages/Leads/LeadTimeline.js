import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { Calendar, FileText, Mail, MessageSquare, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  timeline: {
    maxHeight: 600,
    overflowY: 'auto',
  },
  timelineItem: {
    marginBottom: theme.spacing(2),
  },
  timelineContent: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  timelineHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  timelineUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  userAvatar: {
    width: 32,
    height: 32,
    fontSize: '0.875rem',
  },
  timelineDate: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  timelineType: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  timelineNotes: {
    marginTop: theme.spacing(1),
    fontSize: '0.875rem',
  },
  timelineMetadata: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
  },
  addButton: {
    marginBottom: theme.spacing(2),
  },
  interactionIcon: {
    color: theme.palette.primary.main,
  },
  statusChange: {
    color: theme.palette.info.main,
  },
  email: {
    color: theme.palette.warning.main,
  },
  file: {
    color: theme.palette.success.main,
  },
  message: {
    color: theme.palette.secondary.main,
  },
}));

const LeadTimeline = ({ leadId, onUpdate }) => {
  const classes = useStyles();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: 'note',
    category: 'internal_note',
    notes: '',
    priority: 'medium',
    isPrivate: false,
  });

  useEffect(() => {
    if (leadId) {
      loadTimeline();
    }
  }, [leadId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/lead-status-history/timeline/${leadId}`);
      setTimeline(data.timeline);
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInteraction = async () => {
    try {
      await api.post(`/lead-status-history/${leadId}`, {
        activityType: newInteraction.type,
        notes: newInteraction.notes,
        metadata: {
          category: newInteraction.category,
          priority: newInteraction.priority,
          isPrivate: newInteraction.isPrivate,
        },
      });

      toast.success(i18n.t('interactions.toasts.created'));
      setShowAddDialog(false);
      setNewInteraction({
        type: 'note',
        category: 'internal_note',
        notes: '',
        priority: 'medium',
        isPrivate: false,
      });
      loadTimeline();
      if (onUpdate) onUpdate();
    } catch (err) {
      toastError(err);
    }
  };

  const getInteractionIcon = (type) => {
    const icons = {
      status_change: <Calendar className={classes.statusChange} />,
      pipeline_change: <Calendar className={classes.statusChange} />,
      email: <Mail className={classes.email} />,
      note: <FileText className={classes.interactionIcon} />,
      file: <FileText className={classes.file} />,
      message: <MessageSquare className={classes.message} />,
    };
    return icons[type] || <FileText className={classes.interactionIcon} />;
  };

  const getInteractionColor = (type) => {
    const colors = {
      status_change: '#2196f3',
      pipeline_change: '#2196f3',
      email: '#ff9800',
      note: '#4caf50',
      file: '#4caf50',
      message: '#9c27b0',
    };
    return colors[type] || '#757575';
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box className={classes.root}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>{i18n.t('leads.timeline.title')}</Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Plus />}
          onClick={() => setShowAddDialog(true)}
          className={classes.addButton}
        >
          {i18n.t('interactions.buttons.add')}
        </Button>
      </Box>

      <Paper className={classes.timeline}>
        {timeline.length === 0 ? (
          <Box p={3} textAlign='center'>
            <Typography color='textSecondary'>
              {i18n.t('leads.timeline.empty')}
            </Typography>
          </Box>
        ) : (
          <List>
            {timeline.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem className={classes.timelineItem}>
                  <ListItemIcon>{getInteractionIcon(item.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box className={classes.timelineHeader}>
                        <Box className={classes.timelineUser}>
                          <Avatar className={classes.userAvatar}>
                            {getInitials(item.user?.name || 'User')}
                          </Avatar>
                          <Typography variant='subtitle2'>
                            {item.user?.name}
                          </Typography>
                        </Box>
                        <Typography className={classes.timelineDate}>
                          {formatDate(item.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box className={classes.timelineType}>
                          <Chip
                            label={i18n.t(`interactions.types.${item.type}`)}
                            size='small'
                            style={{
                              backgroundColor: getInteractionColor(item.type),
                              color: 'white',
                            }}
                          />
                        </Box>
                        <Typography className={classes.timelineNotes}>
                          {item.description}
                        </Typography>
                        {item.metadata &&
                          Object.keys(item.metadata).length > 0 && (
                            <Box className={classes.timelineMetadata}>
                              <Typography
                                variant='caption'
                                color='textSecondary'
                              >
                                {JSON.stringify(item.metadata, null, 2)}
                              </Typography>
                            </Box>
                          )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < timeline.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>{i18n.t('interactions.dialog.add')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel>{i18n.t('interactions.form.type')}</InputLabel>
                <Select
                  value={newInteraction.type}
                  onChange={(e) =>
                    setNewInteraction({
                      ...newInteraction,
                      type: e.target.value,
                    })
                  }
                  label={i18n.t('interactions.form.type')}
                >
                  <MenuItem value='note'>
                    {i18n.t('interactions.types.note')}
                  </MenuItem>
                  <MenuItem value='email'>
                    {i18n.t('interactions.types.email')}
                  </MenuItem>
                  <MenuItem value='message'>
                    {i18n.t('interactions.types.message')}
                  </MenuItem>
                  <MenuItem value='file'>
                    {i18n.t('interactions.types.file')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined' margin='dense'>
                <InputLabel>{i18n.t('interactions.form.category')}</InputLabel>
                <Select
                  value={newInteraction.category}
                  onChange={(e) =>
                    setNewInteraction({
                      ...newInteraction,
                      category: e.target.value,
                    })
                  }
                  label={i18n.t('interactions.form.category')}
                >
                  <MenuItem value='internal_note'>
                    {i18n.t('interactions.categories.internal_note')}
                  </MenuItem>
                  <MenuItem value='customer_communication'>
                    {i18n.t('interactions.categories.customer_communication')}
                  </MenuItem>
                  <MenuItem value='system'>
                    {i18n.t('interactions.categories.system')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={i18n.t('interactions.form.notes')}
                value={newInteraction.notes}
                onChange={(e) =>
                  setNewInteraction({
                    ...newInteraction,
                    notes: e.target.value,
                  })
                }
                variant='outlined'
                margin='dense'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)} color='secondary'>
            {i18n.t('common.cancel')}
          </Button>
          <Button
            onClick={handleAddInteraction}
            color='primary'
            variant='contained'
            disabled={!newInteraction.notes.trim()}
          >
            {i18n.t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadTimeline;
