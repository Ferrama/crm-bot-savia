import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Calendar,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import LeadModal from './LeadModal';
import LeadTimeline from './LeadTimeline';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(3),
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  leadTitle: {
    fontSize: '1.1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    fontStyle: 'italic',
  },
  leadDescription: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  statusChip: {
    marginRight: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  infoCard: {
    height: '100%',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
    minWidth: 120,
  },
  infoValue: {
    color: theme.palette.text.secondary,
  },
  financialCard: {
    height: '100%',
  },
  financialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  financialLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  financialValue: {
    fontWeight: 'bold',
  },
  tagsSection: {
    marginTop: theme.spacing(2),
  },
  tagChip: {
    margin: theme.spacing(0.25),
  },
  customFieldsCard: {
    height: '100%',
  },
  customField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
  },
  customFieldLabel: {
    fontWeight: 'bold',
  },
  customFieldValue: {
    color: theme.palette.text.secondary,
  },
  timelineSection: {
    marginTop: theme.spacing(3),
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  userAvatar: {
    width: 32,
    height: 32,
  },
}));

const LeadDetail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (id) {
      loadLead();
      loadTags();
    }
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/leads/${id}`);
      setLead(data);
    } catch (err) {
      toastError(err);
      history.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await api.get('/tags');
      setAvailableTags(data.tags);
    } catch (err) {
      toastError(err);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    loadLead();
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      await api.put(`/leads/${id}`, {
        ...lead,
        tags: [...(lead.tags || []), newTag],
      });
      toast.success(i18n.t('leads.toasts.tagAdded'));
      setNewTag('');
      setShowAddTagDialog(false);
      loadLead();
    } catch (err) {
      toastError(err);
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    try {
      await api.put(`/leads/${id}`, {
        ...lead,
        tags: lead.tags.filter((tag) => tag !== tagToRemove),
      });
      toast.success(i18n.t('leads.toasts.tagRemoved'));
      loadLead();
    } catch (err) {
      toastError(err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#2196f3',
      contacted: '#ff9800',
      follow_up: '#9c27b0',
      proposal: '#4caf50',
      negotiation: '#ff5722',
      qualified: '#00bcd4',
      unqualified: '#f44336',
      converted: '#4caf50',
      lost: '#f44336',
      closed_won: '#4caf50',
      closed_lost: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const getTemperatureColor = (temperature) => {
    const colors = {
      hot: '#ff6b6b',
      warm: '#ffd93d',
      cold: '#6c5ce7',
    };
    return colors[temperature] || '#6c5ce7';
  };

  const formatExpectedValue = (lead) => {
    if (!lead.expectedValue) return '';
    const currency = lead.currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.code || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lead.expectedValue);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box className={classes.root}>
        <Typography>{i18n.t('common.loading')}</Typography>
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box className={classes.root}>
        <Typography>{i18n.t('leads.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.header}>
        <Box className={classes.leadInfo}>
          <Typography className={classes.leadName}>{lead.name}</Typography>
          {lead.title && (
            <Typography className={classes.leadTitle}>{lead.title}</Typography>
          )}
          {lead.description && (
            <Typography className={classes.leadDescription}>
              {lead.description}
            </Typography>
          )}
          <Box>
            <Chip
              label={i18n.t(`leads.status.${lead.status}`)}
              className={classes.statusChip}
              style={{
                backgroundColor: getStatusColor(lead.status),
                color: 'white',
              }}
            />
            <Chip
              label={i18n.t(`leads.pipeline.${lead.pipeline}`)}
              className={classes.statusChip}
            />
            <Chip
              label={i18n.t(`leads.temperature.${lead.temperature}`)}
              style={{
                backgroundColor: getTemperatureColor(lead.temperature),
                color: lead.temperature === 'warm' ? 'black' : 'white',
              }}
            />
          </Box>
        </Box>
        <Box className={classes.actions}>
          <Button
            variant='outlined'
            color='primary'
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            {i18n.t('common.edit')}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={classes.infoCard}>
            <CardHeader title={i18n.t('leads.sections.contact')} />
            <CardContent>
              <div className={classes.infoItem}>
                <User className={classes.infoIcon} />
                <span className={classes.infoLabel}>
                  {i18n.t('leads.fields.contact')}:
                </span>
                <span className={classes.infoValue}>{lead.contact?.name}</span>
              </div>
              {lead.contact?.number && (
                <div className={classes.infoItem}>
                  <Phone className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    {i18n.t('leads.fields.phone')}:
                  </span>
                  <span className={classes.infoValue}>
                    {lead.contact.number}
                  </span>
                </div>
              )}
              {lead.contact?.email && (
                <div className={classes.infoItem}>
                  <Mail className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    {i18n.t('leads.fields.email')}:
                  </span>
                  <span className={classes.infoValue}>
                    {lead.contact.email}
                  </span>
                </div>
              )}
              {lead.source && (
                <div className={classes.infoItem}>
                  <MapPin className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    {i18n.t('leads.fields.source')}:
                  </span>
                  <span className={classes.infoValue}>{lead.source}</span>
                </div>
              )}
              {lead.assignedTo && (
                <div className={classes.infoItem}>
                  <User className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    {i18n.t('leads.fields.assignedTo')}:
                  </span>
                  <div className={classes.assignedUser}>
                    <Avatar className={classes.userAvatar}>
                      {getInitials(lead.assignedTo.name)}
                    </Avatar>
                    <span className={classes.infoValue}>
                      {lead.assignedTo.name}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.financialCard}>
            <CardHeader title={i18n.t('leads.sections.financial')} />
            <CardContent>
              {lead.expectedValue && (
                <div className={classes.financialItem}>
                  <div className={classes.financialLabel}>
                    <DollarSign />
                    <span>{i18n.t('leads.fields.expectedValue')}</span>
                  </div>
                  <span className={classes.financialValue}>
                    {formatExpectedValue(lead)}
                  </span>
                </div>
              )}
              {lead.probability && (
                <div className={classes.financialItem}>
                  <div className={classes.financialLabel}>
                    <Percent />
                    <span>{i18n.t('leads.fields.probability')}</span>
                  </div>
                  <span className={classes.financialValue}>
                    {lead.probability}%
                  </span>
                </div>
              )}
              {lead.expectedClosingDate && (
                <div className={classes.financialItem}>
                  <div className={classes.financialLabel}>
                    <Calendar />
                    <span>{i18n.t('leads.fields.expectedClosingDate')}</span>
                  </div>
                  <span className={classes.financialValue}>
                    {formatDate(lead.expectedClosingDate)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {lead.tags && lead.tags.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title={i18n.t('leads.sections.tags')}
                action={
                  <IconButton
                    size='small'
                    onClick={() => setShowAddTagDialog(true)}
                  >
                    <Plus />
                  </IconButton>
                }
              />
              <CardContent>
                <Box display='flex' flexWrap='wrap'>
                  {lead.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      className={classes.tagChip}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {lead.customFields && Object.keys(lead.customFields).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card className={classes.customFieldsCard}>
              <CardHeader title={i18n.t('leads.sections.customFields')} />
              <CardContent>
                {Object.entries(lead.customFields).map(([key, value]) => (
                  <div key={key} className={classes.customField}>
                    <span className={classes.customFieldLabel}>{key}:</span>
                    <span className={classes.customFieldValue}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {lead.notes && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title={i18n.t('leads.sections.notes')} />
              <CardContent>
                <Typography>{lead.notes}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box className={classes.timelineSection}>
        <LeadTimeline leadId={id} onUpdate={loadLead} />
      </Box>

      <LeadModal
        open={showEditModal}
        onClose={handleCloseEditModal}
        lead={lead}
      />

      <Dialog
        open={showAddTagDialog}
        onClose={() => setShowAddTagDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>{i18n.t('leads.dialog.addTag')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel>{i18n.t('leads.form.tag')}</InputLabel>
            <Select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              label={i18n.t('leads.form.tag')}
            >
              {availableTags
                .filter((tag) => !lead.tags?.includes(tag.name))
                .map((tag) => (
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddTagDialog(false)} color='secondary'>
            {i18n.t('common.cancel')}
          </Button>
          <Button
            onClick={handleAddTag}
            color='primary'
            variant='contained'
            disabled={!newTag}
          >
            {i18n.t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadDetail;
