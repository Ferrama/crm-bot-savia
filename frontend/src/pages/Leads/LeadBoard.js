import {
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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
    minWidth: 300,
    maxWidth: 300,
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
    marginBottom: theme.spacing(1),
  },
  leadInfo: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  temperatureChip: {
    marginTop: theme.spacing(1),
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
  addButton: {
    marginTop: theme.spacing(1),
  },
  tagChip: {
    margin: theme.spacing(0.5),
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
      const { data } = await api.put(`/lead-columns/${selectedColumn.id}`, {
        name: selectedColumn.name,
        color: selectedColumn.color,
      });
      setColumns(columns.map((col) => (col.id === data.id ? data : col)));
      setShowColumnModal(false);
      setSelectedColumn(null);
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
    setShowLeadModal(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
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

  return (
    <div className={classes.root}>
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
                </div>
                <div>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setSelectedColumn(column);
                      setShowColumnModal(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => handleDeleteColumn(column.id)}
                  >
                    <DeleteIcon />
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
                    {column.leads.map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classes.leadCard}
                            onClick={() => handleEditLead(lead)}
                          >
                            <Typography className={classes.leadName}>
                              {lead.name}
                            </Typography>
                            <Typography className={classes.leadInfo}>
                              {lead.contact.name}
                            </Typography>
                            <Typography className={classes.leadInfo}>
                              {lead.contact.number}
                            </Typography>
                            <Box display='flex' flexWrap='wrap' mt={1}>
                              <Chip
                                label={i18n.t(
                                  `leads.temperatures.${lead.temperature}`
                                )}
                                size='small'
                                className={`${
                                  classes.temperatureChip
                                } ${getTemperatureColor(lead.temperature)}`}
                              />
                              {lead.tags?.map((tag) => (
                                <Chip
                                  key={tag.id}
                                  label={tag.name}
                                  size='small'
                                  className={classes.tagChip}
                                  style={{
                                    backgroundColor: tag.color || '#ccc',
                                    color: 'white',
                                  }}
                                />
                              ))}
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => handleAddLead(column.id)}
                      className={classes.addButton}
                    >
                      {i18n.t('leads.buttons.add')}
                    </Button>
                  </div>
                )}
              </Droppable>
            </Paper>
          ))}
          <Button
            variant='outlined'
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedColumn(null);
              setShowColumnModal(true);
            }}
          ></Button>
        </div>
      </DragDropContext>

      <Dialog
        open={showColumnModal}
        onClose={() => {
          setShowColumnModal(false);
          setSelectedColumn(null);
          setNewColumn({ name: '', color: '#000000' });
        }}
      >
        <DialogTitle>
          {selectedColumn
            ? i18n.t('leads.leadColumns.modal.edit.title')
            : i18n.t('leads.leadColumns.modal.add.title')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.t('leads.leadColumns.modal.form.name')}
                value={selectedColumn ? selectedColumn.name : newColumn.name}
                onChange={(e) =>
                  selectedColumn
                    ? setSelectedColumn({
                        ...selectedColumn,
                        name: e.target.value,
                      })
                    : setNewColumn({ ...newColumn, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='color'
                label={i18n.t('leads.leadColumns.modal.form.color')}
                value={selectedColumn ? selectedColumn.color : newColumn.color}
                onChange={(e) =>
                  selectedColumn
                    ? setSelectedColumn({
                        ...selectedColumn,
                        color: e.target.value,
                      })
                    : setNewColumn({ ...newColumn, color: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowColumnModal(false);
              setSelectedColumn(null);
              setNewColumn({ name: '', color: '#000000' });
            }}
          >
            {i18n.t('leads.leadColumns.buttons.cancel')}
          </Button>
          <Button
            onClick={selectedColumn ? handleEditColumn : handleAddColumn}
            color='primary'
            variant='contained'
          >
            {i18n.t('leads.leadColumns.buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <LeadModal
        open={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setSelectedLead(null);
          setSelectedColumn(null);
          loadColumns();
        }}
        lead={selectedLead}
        columnId={selectedColumn?.id}
      />
    </div>
  );
};

export default LeadBoard;
