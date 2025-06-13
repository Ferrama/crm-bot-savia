import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Calendar,
  DollarSign,
  Edit,
  Percent,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import LeadModal from './LeadModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  board: {
    display: 'flex',
    overflowX: 'auto',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    flex: 1,
    minHeight: 0,
  },
  column: {
    minWidth: 320,
    maxWidth: 320,
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
  },
  columnHeader: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  columnColor: {
    width: 16,
    height: 16,
    borderRadius: '50%',
  },
  columnContent: {
    padding: theme.spacing(1),
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  leadCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  },
  leadName: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5),
    fontSize: '1rem',
  },
  leadTitle: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    fontStyle: 'italic',
  },
  leadDescription: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  leadInfo: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  temperatureChip: {
    marginTop: theme.spacing(1),
    height: 20,
    fontSize: '0.75rem',
  },
  hotChip: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  warmChip: {
    backgroundColor: '#ffd93d',
    color: 'black',
  },
  coldChip: {
    backgroundColor: '#6c5ce7',
    color: 'white',
  },
  statusChip: {
    height: 20,
    fontSize: '0.75rem',
    marginBottom: theme.spacing(1),
  },
  addButton: {
    marginTop: theme.spacing(1),
  },
  tagChip: {
    margin: theme.spacing(0.25),
    height: 18,
    fontSize: '0.7rem',
  },
  leadMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  leadMetaIcon: {
    width: 14,
    height: 14,
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  userAvatar: {
    width: 20,
    height: 20,
    fontSize: '0.75rem',
  },
}));

const LeadSchema = Yup.object().shape({
  contactId: Yup.number().required(i18n.t('leads.validation.contact.required')),
  // ...otros campos
});

const LeadBoard = () => {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newColumn, setNewColumn] = useState({ name: '', color: '#000000' });

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      const { data } = await api.get('/lead-columns');
      setColumns(data);
    } catch (err) {
      toastError(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceColumn = columns.find(
      (col) => col.id === parseInt(source.droppableId)
    );
    const destColumn = columns.find(
      (col) => col.id === parseInt(destination.droppableId)
    );

    if (sourceColumn.id === destColumn.id) return;

    try {
      await api.post('/leads/move', {
        leadId: parseInt(draggableId),
        columnId: destColumn.id,
      });

      // Update local state
      const updatedColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            leads: col.leads.filter(
              (lead) => lead.id !== parseInt(draggableId)
            ),
          };
        }
        if (col.id === destColumn.id) {
          const movedLead = sourceColumn.leads.find(
            (lead) => lead.id === parseInt(draggableId)
          );
          return {
            ...col,
            leads: [...col.leads, { ...movedLead, columnId: col.id }],
          };
        }
        return col;
      });

      setColumns(updatedColumns);
    } catch (err) {
      toastError(err);
    }
  };

  const handleAddColumn = async () => {
    try {
      const { data } = await api.post('/lead-columns', {
        ...newColumn,
        order: columns.length + 1,
      });
      setColumns([...columns, data]);
      setShowColumnModal(false);
      setNewColumn({ name: '', color: '#000000' });
      toast.success(i18n.t('leadColumns.toasts.created'));
    } catch (err) {
      toastError(err);
    }
  };

  const handleEditColumn = async () => {
    try {
      const { data } = await api.put(
        `/lead-columns/${selectedColumn.id}`,
        newColumn
      );
      setColumns(
        columns.map((col) => (col.id === selectedColumn.id ? data : col))
      );
      setShowColumnModal(false);
      setSelectedColumn(null);
      setNewColumn({ name: '', color: '#000000' });
      toast.success(i18n.t('leadColumns.toasts.updated'));
    } catch (err) {
      toastError(err);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await api.delete(`/lead-columns/${columnId}`);
      setColumns(columns.filter((col) => col.id !== columnId));
      toast.success(i18n.t('leadColumns.toasts.deleted'));
    } catch (err) {
      toastError(err);
    }
  };

  const handleAddLead = (columnId) => {
    setSelectedColumn(columns.find((col) => col.id === columnId));
    setSelectedLead(null);
    setShowLeadModal(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setSelectedColumn(null);
    setShowLeadModal(true);
  };

  const getTemperatureColor = (temperature) => {
    const colors = {
      hot: classes.hotChip,
      warm: classes.warmChip,
      cold: classes.coldChip,
    };
    return colors[temperature] || classes.coldChip;
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

  return (
    <div className={classes.root}>
      <Dialog
        open={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {selectedColumn
            ? i18n.t('leadColumns.dialog.edit')
            : i18n.t('leadColumns.dialog.new')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.t('leadColumns.form.name')}
                value={newColumn.name}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, name: e.target.value })
                }
                variant='outlined'
                margin='dense'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.t('leadColumns.form.color')}
                type='color'
                value={newColumn.color}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, color: e.target.value })
                }
                variant='outlined'
                margin='dense'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowColumnModal(false)} color='secondary'>
            {i18n.t('common.cancel')}
          </Button>
          <Button
            onClick={selectedColumn ? handleEditColumn : handleAddColumn}
            color='primary'
            variant='contained'
          >
            {selectedColumn ? i18n.t('common.update') : i18n.t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <LeadModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        reload={loadColumns}
        lead={selectedLead}
        columnId={selectedColumn?.id}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.board}>
          {columns.map((column) => (
            <Paper key={column.id} className={classes.column}>
              <div className={classes.columnHeader}>
                <div className={classes.columnTitle}>
                  <div
                    className={classes.columnColor}
                    style={{ backgroundColor: column.color }}
                  />
                  <Typography variant='h6'>{column.name}</Typography>
                  <Chip
                    label={column.leads?.length || 0}
                    size='small'
                    color='primary'
                  />
                </div>
                <div>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setSelectedColumn(column);
                      setNewColumn({ name: column.name, color: column.color });
                      setShowColumnModal(true);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDeleteColumn(column.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
              <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={classes.columnContent}
                  >
                    {column.leads?.map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.droppableProps}
                            className={classes.leadCard}
                            onClick={() => handleEditLead(lead)}
                          >
                            <div className={classes.leadName}>{lead.name}</div>

                            {lead.title && (
                              <div className={classes.leadTitle}>
                                {lead.title}
                              </div>
                            )}

                            {lead.description && (
                              <div className={classes.leadDescription}>
                                {lead.description}
                              </div>
                            )}

                            <Chip
                              label={i18n.t(`leads.status.${lead.status}`)}
                              className={classes.statusChip}
                              style={{
                                backgroundColor: getStatusColor(lead.status),
                                color: 'white',
                              }}
                              size='small'
                            />

                            <div className={classes.leadMeta}>
                              <User className={classes.leadMetaIcon} />
                              <span>{lead.contact?.name}</span>
                            </div>

                            {lead.expectedValue && (
                              <div className={classes.leadMeta}>
                                <DollarSign className={classes.leadMetaIcon} />
                                <span>{formatExpectedValue(lead)}</span>
                              </div>
                            )}

                            {lead.probability && (
                              <div className={classes.leadMeta}>
                                <Percent className={classes.leadMetaIcon} />
                                <span>{lead.probability}%</span>
                              </div>
                            )}

                            {lead.expectedClosingDate && (
                              <div className={classes.leadMeta}>
                                <Calendar className={classes.leadMetaIcon} />
                                <span>
                                  {formatDate(lead.expectedClosingDate)}
                                </span>
                              </div>
                            )}

                            <Chip
                              label={i18n.t(
                                `leads.temperature.${lead.temperature}`
                              )}
                              className={`${
                                classes.temperatureChip
                              } ${getTemperatureColor(lead.temperature)}`}
                              size='small'
                            />

                            {lead.tags && lead.tags.length > 0 && (
                              <Box className={classes.chips}>
                                {lead.tags.slice(0, 3).map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    className={classes.tagChip}
                                    size='small'
                                  />
                                ))}
                                {lead.tags.length > 3 && (
                                  <Chip
                                    label={`+${lead.tags.length - 3}`}
                                    className={classes.tagChip}
                                    size='small'
                                  />
                                )}
                              </Box>
                            )}

                            {lead.assignedTo && (
                              <div className={classes.assignedUser}>
                                <Avatar className={classes.userAvatar}>
                                  {getInitials(lead.assignedTo.name)}
                                </Avatar>
                                <Typography variant='caption'>
                                  {lead.assignedTo.name}
                                </Typography>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button
                      fullWidth
                      variant='outlined'
                      onClick={() => handleAddLead(column.id)}
                      className={classes.addButton}
                      startIcon={<Plus />}
                    >
                      {i18n.t('leads.buttons.add')}
                    </Button>
                  </div>
                )}
              </Droppable>
            </Paper>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default LeadBoard;
