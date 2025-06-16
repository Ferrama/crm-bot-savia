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
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Calendar,
  DollarSign,
  Edit,
  HelpCircle,
  Percent,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import Title from '../../components/Title';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';
import LeadModal from './LeadModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  board: {
    display: 'flex',
    overflowX: 'auto',
    padding: theme.spacing(1),
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
    width: 320,
  },
  columnHeader: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
    minWidth: 0,
  },
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 0,
    flex: 1,
  },
  columnColor: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    flexShrink: 0,
  },
  columnContent: {
    padding: theme.spacing(1),
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    transition: 'all 0.3s ease-in-out',
    minWidth: 0,
  },
  leadCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    transform: 'translateY(0)',
    opacity: 1,
    border: `1px solid ${theme.palette.grey[200]}`,
    width: '100%',
    minWidth: 0,
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-3px)',
      borderColor: theme.palette.primary.light,
    },
  },
  leadCardDragging: {
    transform: 'rotate(3deg)',
    boxShadow: theme.shadows[8],
  },
  leadCardRemoving: {
    transform: 'translateX(-100%)',
    opacity: 0,
    transition: 'all 0.3s ease-in-out',
  },
  leadCardAdding: {
    transform: 'translateX(100%)',
    opacity: 0,
    animation: '$slideIn 0.3s ease-in-out forwards',
  },
  '@keyframes slideIn': {
    '0%': {
      transform: 'translateX(100%)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  leadHeader: {
    marginBottom: theme.spacing(1.5),
    minWidth: 0,
  },
  leadName: {
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.grey[900],
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.3,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    maxWidth: '100%',
  },
  leadTitle: {
    fontSize: '0.875rem',
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(0.5),
    fontStyle: 'italic',
    lineHeight: 1.4,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    maxWidth: '100%',
  },
  leadDescription: {
    fontSize: '0.8rem',
    color: theme.palette.grey[500],
    marginBottom: theme.spacing(1),
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: 1.4,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    maxWidth: '100%',
  },
  leadStatus: {
    marginBottom: theme.spacing(1.5),
  },
  statusChip: {
    height: 22,
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
    maxWidth: '100%',
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
  },
  temperatureChip: {
    height: 20,
    fontSize: '0.7rem',
    fontWeight: 500,
    maxWidth: '100%',
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
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
  leadMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
    fontSize: '0.75rem',
    color: theme.palette.grey[600],
    padding: theme.spacing(0.5, 0),
    minWidth: 0,
  },
  leadMetaIcon: {
    width: 14,
    height: 14,
    color: theme.palette.primary.main,
    flexShrink: 0,
  },
  leadMetaValue: {
    fontWeight: 500,
    color: theme.palette.grey[700],
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    minWidth: 0,
    flex: 1,
  },
  financialInfo: {
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[200]}`,
    minWidth: 0,
  },
  financialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    minWidth: 0,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  financialLabel: {
    fontSize: '0.7rem',
    color: theme.palette.grey[600],
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    minWidth: 0,
    flex: 1,
  },
  financialValue: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: theme.palette.grey[800],
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: theme.spacing(1),
  },
  tagsSection: {
    marginBottom: theme.spacing(1),
    minWidth: 0,
  },
  tagChip: {
    margin: theme.spacing(0.25),
    height: 18,
    fontSize: '0.65rem',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    maxWidth: '100%',
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
    padding: theme.spacing(0.75),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[200]}`,
    minWidth: 0,
  },
  userAvatar: {
    width: 24,
    height: 24,
    fontSize: '0.75rem',
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  userName: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.palette.grey[800],
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '0.65rem',
    color: theme.palette.grey[500],
  },
  addButton: {
    marginTop: theme.spacing(1),
  },
  helpIcon: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    minWidth: 0,
    maxWidth: '100%',
  },
}));

const LeadBoard = () => {
  const classes = useStyles();
  const [columns, setColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newColumn, setNewColumn] = useState({ name: '', color: '#000000' });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async (updatedLead = null) => {
    try {
      const { data } = await api.get('/lead-columns');

      // Si se proporciona un lead actualizado, actualizar el lead en las columnas
      if (updatedLead) {
        const updatedColumns = data.map((column) => ({
          ...column,
          leads:
            column.leads?.map((lead) =>
              lead.id === updatedLead.id ? updatedLead : lead
            ) || [],
        }));
        setColumns(updatedColumns);
        setSelectedLead(updatedLead);
      } else {
        setColumns(data);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleDragStart = (result) => {
    setIsDragging(true);
  };

  const handleDragUpdate = (result) => {
    // Optional: Add any logic during drag
  };

  const handleDragEnd = async (result) => {
    setIsDragging(false);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceColumn = columns.find(
      (col) => col.id === parseInt(source.droppableId)
    );
    const destColumn = columns.find(
      (col) => col.id === parseInt(destination.droppableId)
    );

    if (sourceColumn.id === destColumn.id) return;

    const leadId = parseInt(draggableId);
    const movedLead = sourceColumn.leads.find((lead) => lead.id === leadId);

    // Optimistic update for smoother UX
    const optimisticColumns = columns.map((col) => {
      if (col.id === sourceColumn.id) {
        return {
          ...col,
          leads: col.leads.filter((lead) => lead.id !== leadId),
        };
      }
      if (col.id === destColumn.id) {
        return {
          ...col,
          leads: [...col.leads, { ...movedLead, columnId: col.id }],
        };
      }
      return col;
    });

    // Apply optimistic update immediately
    setColumns(optimisticColumns);

    try {
      await api.post('/leads/move', {
        leadId: leadId,
        columnId: destColumn.id,
      });

      // Success - keep the optimistic update
      toast.success(i18n.t('leads.toasts.updated'));
    } catch (err) {
      // Revert on error
      setColumns(columns);
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
    // Mapeo de códigos de columna a estados
    const statusToColumnCode = {
      new: 'new',
      contacted: 'contacted',
      follow_up: 'follow_up',
      proposal: 'proposal',
      negotiation: 'negotiation',
      qualified: 'qualified',
      unqualified: 'not_qualified',
      converted: 'converted',
      lost: 'lost',
      closed_won: 'closed_won',
      closed_lost: 'closed_lost',
    };

    // Colores de respaldo por si las columnas no están cargadas
    const fallbackColors = {
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

    // Buscar la columna correspondiente al status
    const columnCode = statusToColumnCode[status];
    if (columnCode && columns.length > 0) {
      const correspondingColumn = columns.find(
        (column) => column.code === columnCode
      );
      if (correspondingColumn) {
        return correspondingColumn.color;
      }
    }

    // Usar color de respaldo si no se encuentra la columna
    return fallbackColors[status] || '#757575';
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

  const getColumnTooltip = (column) => {
    if (column.code) {
      return i18n.t(`leads.columnTooltips.${column.code}`);
    }
    return i18n.t('leads.columnTooltips.custom');
  };

  const updateColumnColors = () => {
    // Implement the logic to update column colors
    console.log('Updating column colors');
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t('leads.board.title')}</Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>

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
              {selectedColumn
                ? i18n.t('common.update')
                : i18n.t('common.create')}
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

        <DragDropContext
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
        >
          <div className={classes.board}>
            {columns.map((column) => (
              <Paper key={column.id} className={classes.column}>
                <div className={classes.columnHeader}>
                  <div className={classes.columnTitle}>
                    <div
                      className={classes.columnColor}
                      style={{ backgroundColor: column.color }}
                    />
                    <Typography variant='h6'>
                      {column.code
                        ? i18n.t(`leads.columnCodes.${column.code}`)
                        : column.name}
                    </Typography>
                    <Tooltip
                      title={getColumnTooltip(column)}
                      placement='top'
                      arrow
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <IconButton
                        size='small'
                        style={{ padding: 4 }}
                        className={classes.helpIcon}
                      >
                        <HelpCircle size={16} />
                      </IconButton>
                    </Tooltip>
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
                        setNewColumn({
                          name: column.name,
                          color: column.color,
                        });
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
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${classes.leadCard} ${
                                snapshot.isDragging
                                  ? classes.leadCardDragging
                                  : ''
                              }`}
                              onClick={() => handleEditLead(lead)}
                            >
                              <div className={classes.leadHeader}>
                                <div className={classes.leadName}>
                                  {lead.name}
                                </div>
                                {lead.title && (
                                  <div className={classes.leadTitle}>
                                    {lead.title}
                                  </div>
                                )}
                              </div>
                              <div className={classes.leadDescription}>
                                {lead.description}
                              </div>
                              <div className={classes.leadStatus}>
                                <Chip
                                  label={i18n.t(`leads.status.${lead.status}`)}
                                  className={classes.statusChip}
                                  style={{
                                    backgroundColor: getStatusColor(
                                      lead.status
                                    ),
                                    color: 'white',
                                  }}
                                  size='small'
                                />
                              </div>
                              <div className={classes.leadMeta}>
                                <User className={classes.leadMetaIcon} />
                                <span className={classes.leadMetaValue}>
                                  {lead.contact?.name}
                                </span>
                              </div>

                              {(lead.expectedValue ||
                                lead.probability ||
                                lead.expectedClosingDate) && (
                                <div className={classes.financialInfo}>
                                  {lead.expectedValue && (
                                    <div className={classes.financialItem}>
                                      <span className={classes.financialLabel}>
                                        <DollarSign size={12} />
                                        {i18n.t('leads.fields.expectedValue')}
                                      </span>
                                      <span className={classes.financialValue}>
                                        {formatExpectedValue(lead)}
                                      </span>
                                    </div>
                                  )}
                                  {lead.probability && (
                                    <div className={classes.financialItem}>
                                      <span className={classes.financialLabel}>
                                        <Percent size={12} />
                                        {i18n.t('leads.fields.probability')}
                                      </span>
                                      <span className={classes.financialValue}>
                                        {lead.probability}%
                                      </span>
                                    </div>
                                  )}
                                  {lead.expectedClosingDate && (
                                    <div className={classes.financialItem}>
                                      <span className={classes.financialLabel}>
                                        <Calendar size={12} />
                                        {i18n.t(
                                          'leads.fields.expectedClosingDate'
                                        )}
                                      </span>
                                      <span className={classes.financialValue}>
                                        {formatDate(lead.expectedClosingDate)}
                                      </span>
                                    </div>
                                  )}
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

                              <div className={classes.tagsSection}>
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
                              </div>

                              {lead.assignedTo && (
                                <div className={classes.assignedUser}>
                                  <Avatar className={classes.userAvatar}>
                                    {getInitials(lead.assignedTo.name)}
                                  </Avatar>
                                  <div className={classes.userInfo}>
                                    <Typography
                                      variant='caption'
                                      className={classes.userName}
                                    >
                                      {lead.assignedTo.name}
                                    </Typography>
                                  </div>
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
    </MainContainer>
  );
};

export default LeadBoard;
