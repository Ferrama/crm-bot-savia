import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ViewList, ViewModule } from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useRef, useState } from 'react';
import { i18n } from '../../translate/i18n';
import LeadBoard from './LeadBoard';
import LeadList from './LeadList';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
    gap: theme.spacing(2),
  },
  title: {
    fontWeight: 700,
    fontSize: '2rem',
    letterSpacing: '-0.5px',
    color: theme.palette.text.primary,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  toggleButton: {
    minWidth: 120,
    height: 48,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    transition: 'all 0.2s ease-in-out',
    '&:first-child': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRight: 'none',
    },
    '&:last-child': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeft: 'none',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
  toggleButtonGroup: {
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      '&:not(:first-child)': {
        marginLeft: 0,
      },
    },
  },
  tabContent: {
    flex: 1,
    minHeight: 0,
  },
}));

const Leads = () => {
  const classes = useStyles();
  const [view, setView] = useState('board');
  const boardRef = useRef();

  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      setView(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <Box className={classes.toggleContainer}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label='view mode'
          size='large'
          className={classes.toggleButtonGroup}
        >
          <ToggleButton
            value='board'
            aria-label='board view'
            className={classes.toggleButton}
          >
            <ViewModule style={{ marginRight: 8 }} />
            {i18n.t('leads.views.board')}
          </ToggleButton>
          <ToggleButton
            value='list'
            aria-label='list view'
            className={classes.toggleButton}
          >
            <ViewList style={{ marginRight: 8 }} />
            {i18n.t('leads.views.list')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <div className={classes.tabContent}>
        {view === 'board' ? <LeadBoard ref={boardRef} /> : <LeadList />}
      </div>
    </div>
  );
};

export default Leads;
