import { Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { i18n } from '../../translate/i18n';
import LeadBoard from './LeadBoard';
import LeadList from './LeadList';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabContent: {
    flex: 1,
    minHeight: 0,
  },
}));

const Leads = () => {
  const classes = useStyles();
  const [view, setView] = useState('board');

  const handleViewChange = (event, newValue) => {
    setView(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.tabs}>
        <Tabs
          value={view}
          onChange={handleViewChange}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab value='board' label={i18n.t('leads.views.board')} />
          <Tab value='list' label={i18n.t('leads.views.list')} />
        </Tabs>
      </Paper>
      <div className={classes.tabContent}>
        {view === 'board' ? <LeadBoard /> : <LeadList />}
      </div>
    </div>
  );
};

export default Leads;
