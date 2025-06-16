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
  FileText,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  Settings,
  Tag as TagIcon,
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
    backgroundColor: theme.palette.grey[50],
    minHeight: '100vh',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[1],
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.grey[900],
  },
  leadTitle: {
    fontSize: '1.25rem',
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(1),
    fontStyle: 'italic',
  },
  leadDescription: {
    fontSize: '1rem',
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  statusChip: {
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  contentGrid: {
    marginBottom: theme.spacing(3),
  },
  card: {
    height: '100%',
    backgroundColor: 'white',
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    '& .MuiCardHeader-title': {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: theme.palette.grey[800],
    },
  },
  cardContent: {
    padding: theme.spacing(2),
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  infoIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    width: 20,
    height: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(0.5),
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.grey[900],
  },
  financialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  financialLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.875rem',
    color: theme.palette.grey[600],
  },
  financialValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: theme.palette.grey[900],
  },
  tagsSection: {
    marginTop: theme.spacing(2),
  },
  tagChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
  },
  customField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  customFieldLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.grey[700],
  },
  customFieldValue: {
    fontSize: '0.875rem',
    color: theme.palette.grey[600],
  },
  timelineSection: {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflow: 'hidden',
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  userAvatar: {
    width: 28,
    height: 28,
    fontSize: '0.875rem',
    backgroundColor: theme.palette.primary.main,
  },
  notesCard: {
    backgroundColor: 'white',
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
  },
  notesContent: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.grey[500],
  },
  divider: {
    margin: theme.spacing(2, 0),
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
      {/* Header Section */}
      <Paper className={classes.header}>
        <Box className={classes.headerContent}>
          <Box className={classes.leadInfo}>
            <Typography className={classes.leadName}>{lead.name}</Typography>
            {lead.title && (
              <Typography className={classes.leadTitle}>
                {lead.title}
              </Typography>
            )}
            {lead.description && (
              <Typography className={classes.leadDescription}>
                {lead.description}
              </Typography>
            )}
            <Box className={classes.statusSection}>
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
                variant='outlined'
              />
              <Chip
                label={i18n.t(`leads.temperature.${lead.temperature}`)}
                className={classes.statusChip}
                style={{
                  backgroundColor: getTemperatureColor(lead.temperature),
                  color: lead.temperature === 'warm' ? 'black' : 'white',
                }}
              />
            </Box>
          </Box>
          <Box className={classes.actions}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              {i18n.t('common.edit')}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content Grid */}
      <Grid container spacing={3} className={classes.contentGrid}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={i18n.t('leads.sections.contact')}
              avatar={<User size={20} />}
            />
            <CardContent className={classes.cardContent}>
              <div className={classes.infoItem}>
                <User className={classes.infoIcon} />
                <div className={classes.infoContent}>
                  <div className={classes.infoLabel}>
                    {i18n.t('leads.fields.contact')}
                  </div>
                  <div className={classes.infoValue}>{lead.contact?.name}</div>
                </div>
              </div>

              {lead.contact?.number && (
                <div className={classes.infoItem}>
                  <Phone className={classes.infoIcon} />
                  <div className={classes.infoContent}>
                    <div className={classes.infoLabel}>
                      {i18n.t('leads.fields.phone')}
                    </div>
                    <div className={classes.infoValue}>
                      {lead.contact.number}
                    </div>
                  </div>
                </div>
              )}

              {lead.contact?.email && (
                <div className={classes.infoItem}>
                  <Mail className={classes.infoIcon} />
                  <div className={classes.infoContent}>
                    <div className={classes.infoLabel}>
                      {i18n.t('leads.fields.email')}
                    </div>
                    <div className={classes.infoValue}>
                      {lead.contact.email}
                    </div>
                  </div>
                </div>
              )}

              {lead.source && (
                <div className={classes.infoItem}>
                  <MapPin className={classes.infoIcon} />
                  <div className={classes.infoContent}>
                    <div className={classes.infoLabel}>
                      {i18n.t('leads.fields.source')}
                    </div>
                    <div className={classes.infoValue}>{lead.source}</div>
                  </div>
                </div>
              )}

              {lead.assignedTo && (
                <div className={classes.infoItem}>
                  <User className={classes.infoIcon} />
                  <div className={classes.infoContent}>
                    <div className={classes.infoLabel}>
                      {i18n.t('leads.fields.assignedTo')}
                    </div>
                    <div className={classes.assignedUser}>
                      <Avatar className={classes.userAvatar}>
                        {getInitials(lead.assignedTo.name)}
                      </Avatar>
                      <span className={classes.infoValue}>
                        {lead.assignedTo.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Information */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={i18n.t('leads.sections.financial')}
              avatar={<DollarSign size={20} />}
            />
            <CardContent className={classes.cardContent}>
              {lead.expectedValue ? (
                <div className={classes.financialItem}>
                  <div className={classes.financialLabel}>
                    <DollarSign size={16} />
                    <span>{i18n.t('leads.fields.expectedValue')}</span>
                  </div>
                  <span className={classes.financialValue}>
                    {formatExpectedValue(lead)}
                  </span>
                </div>
              ) : (
                <div className={classes.emptyState}>
                  <DollarSign size={24} />
                  <Typography variant='body2'>
                    {i18n.t('leads.noFinancialData')}
                  </Typography>
                </div>
              )}

              {lead.probability && (
                <div className={classes.financialItem}>
                  <div className={classes.financialLabel}>
                    <Percent size={16} />
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
                    <Calendar size={16} />
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

        {/* Tags Section */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={i18n.t('leads.sections.tags')}
              avatar={<TagIcon size={20} />}
              action={
                <IconButton
                  size='small'
                  onClick={() => setShowAddTagDialog(true)}
                >
                  <Plus />
                </IconButton>
              }
            />
            <CardContent className={classes.cardContent}>
              {lead.tags && lead.tags.length > 0 ? (
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
              ) : (
                <div className={classes.emptyState}>
                  <TagIcon size={24} />
                  <Typography variant='body2'>
                    {i18n.t('leads.noTags')}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Fields */}
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              title={i18n.t('leads.sections.customFields')}
              avatar={<Settings size={20} />}
            />
            <CardContent className={classes.cardContent}>
              {lead.customFields &&
              Object.keys(lead.customFields).length > 0 ? (
                Object.entries(lead.customFields).map(([key, value]) => (
                  <div key={key} className={classes.customField}>
                    <span className={classes.customFieldLabel}>{key}:</span>
                    <span className={classes.customFieldValue}>{value}</span>
                  </div>
                ))
              ) : (
                <div className={classes.emptyState}>
                  <Settings size={24} />
                  <Typography variant='body2'>
                    {i18n.t('leads.noCustomFields')}
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notes Section */}
        {lead.notes && (
          <Grid item xs={12}>
            <Card className={classes.notesCard}>
              <CardHeader
                className={classes.cardHeader}
                title={i18n.t('leads.sections.notes')}
                avatar={<FileText size={20} />}
              />
              <div className={classes.notesContent}>
                <Typography variant='body1' style={{ lineHeight: 1.6 }}>
                  {lead.notes}
                </Typography>
              </div>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Timeline Section */}
      <Box className={classes.timelineSection}>
        <LeadTimeline leadId={id} onUpdate={loadLead} />
      </Box>

      {/* Modals */}
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
