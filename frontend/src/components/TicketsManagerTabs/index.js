import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Badge from '@material-ui/core/Badge';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Search } from 'lucide-react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import NewTicketModal from '../NewTicketModal';
import TabPanel from '../TabPanel';
import TicketsList from '../TicketsListCustom';

import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-ui/core';
import { CheckSquare, Inbox } from 'lucide-react';
import { AuthContext } from '../../context/Auth/AuthContext';
import useSettings from '../../hooks/useSettings';
import { i18n } from '../../translate/i18n';
import { Can } from '../Can';
import { TagsFilter } from '../TagsFilter';
import TicketsQueueSelect from '../TicketsQueueSelect';
import { UsersFilter } from '../UsersFilter';

const useStyles = makeStyles((theme) => ({
  ticketsWrapper: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  tabsHeader: {
    flex: 'none',
    // backgroundColor: "#eee",
  },

  settingsIcon: {
    alignSelf: 'center',
    marginLeft: 'auto',
    padding: 8,
  },

  tabWithGroups: {
    minWidth: 90,
    width: 90,
  },

  tab: {
    minWidth: 120,
    width: 120,
  },

  ticketOptionsBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // background: "#fafafa",
    padding: theme.spacing(1),
  },

  serachInputWrapper: {
    flex: 1,
    // background: "#fff",
    display: 'flex',
    borderRadius: 40,
    padding: 4,
    marginRight: theme.spacing(1),
  },

  searchIcon: {
    color: 'grey',
    marginLeft: 6,
    marginRight: 6,
    alignSelf: 'center',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    borderRadius: 30,
  },

  badge: {
    right: '-10px',
  },
  show: {
    display: 'block',
  },
  hide: {
    display: 'none !important',
  },

  icon24: {
    width: 24,
    height: 24,
  },
}));

const TicketsManagerTabs = () => {
  const classes = useStyles();
  const history = useHistory();

  const [searchParam, setSearchParam] = useState('');
  const [tab, setTab] = useState('open');
  const [tabOpen, setTabOpen] = useState('open');
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef();
  const { user } = useContext(AuthContext);
  const { profile } = user;

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { getSetting } = useSettings();
  const [showTabGroups, setShowTabGroups] = useState(false);

  useEffect(() => {
    Promise.all([getSetting('CheckMsgIsGroup'), getSetting('groupsTab')]).then(
      ([ignoreGroups, groupsTab]) => {
        setShowTabGroups(
          ignoreGroups === 'disabled' && groupsTab === 'enabled'
        );
      }
    );
  }, []);

  useEffect(() => {
    if (user.profile.toUpperCase() === 'ADMIN') {
      setShowAllTickets(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'search') {
      searchInputRef.current.focus();
    }
  }, [tab]);

  let searchTimeout;

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map((t) => t.id);
    setSelectedTags(tags);
  };

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setSelectedUsers(users);
  };

  return (
    <Paper elevation={0} variant='outlined' className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(ticket) => {
          handleCloseOrOpenTicket(ticket);
        }}
      />
      <Paper elevation={0} square className={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant='fullWidth'
          indicatorColor='primary'
          textColor='primary'
          aria-label='icon label tabs example'
        >
          <Tab
            value={'open'}
            icon={<Inbox />}
            label={i18n.t('tickets.tabs.open.title')}
            classes={{
              root: showTabGroups ? classes.tabWithGroups : classes.tab,
            }}
          />

          {showTabGroups && (
            <Tab
              value={'groups'}
              icon={
                <FontAwesomeIcon
                  className={classes.icon24}
                  icon={faPeopleGroup}
                />
              }
              label={i18n.t('tickets.tabs.groups.title')}
              classes={{ root: classes.tabWithGroups }}
            />
          )}

          <Tab
            value={'closed'}
            icon={<CheckSquare />}
            label={i18n.t('tickets.tabs.closed.title')}
            classes={{
              root: showTabGroups ? classes.tabWithGroups : classes.tab,
            }}
          />

          <Tab
            value={'search'}
            icon={<Search />}
            label={i18n.t('tickets.tabs.search.title')}
            classes={{
              root: showTabGroups ? classes.tabWithGroups : classes.tab,
            }}
          />
        </Tabs>
      </Paper>
      <Paper square elevation={0} className={classes.ticketOptionsBox}>
        {tab === 'search' ? (
          <div className={classes.serachInputWrapper}>
            <Search />
            <InputBase
              className={classes.searchInput}
              inputRef={searchInputRef}
              placeholder={i18n.t('tickets.search.placeholder')}
              type='search'
              onChange={handleSearch}
            />
          </div>
        ) : (
          <>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setNewTicketModalOpen(true)}
            >
              {i18n.t('ticketsManager.buttons.newTicket')}
            </Button>
            {tab === 'open' && (
              <Can
                role={user.profile}
                perform='tickets-manager:showall'
                yes={() => (
                  <FormControlLabel
                    label={i18n.t('tickets.buttons.showAll')}
                    labelPlacement='start'
                    control={
                      <Switch
                        size='small'
                        checked={showAllTickets}
                        onChange={() =>
                          setShowAllTickets((prevState) => !prevState)
                        }
                        name='showAllTickets'
                        color='primary'
                      />
                    }
                  />
                )}
              />
            )}
          </>
        )}
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          onChange={(values) => setSelectedQueueIds(values)}
        />
      </Paper>
      <TabPanel value={tab} name='open' className={classes.ticketsWrapper}>
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={openCount}
                color='primary'
              >
                {i18n.t('ticketsList.assignedHeader')}
              </Badge>
            }
            value={'open'}
          />
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={pendingCount}
                color='secondary'
              >
                {i18n.t('ticketsList.pendingHeader')}
              </Badge>
            }
            value={'pending'}
          />
        </Tabs>
        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status='open'
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle('open')}
            setTabOpen={setTabOpen}
            showTabGroups={showTabGroups}
          />
          <TicketsList
            status='pending'
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle('pending')}
            setTabOpen={setTabOpen}
            showTabGroups={showTabGroups}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={tab} name='closed' className={classes.ticketsWrapper}>
        <TicketsList
          status='closed'
          showAll={true}
          selectedQueueIds={selectedQueueIds}
          showTabGroups={showTabGroups}
        />
      </TabPanel>
      <TabPanel value={tab} name='groups' className={classes.ticketsWrapper}>
        <TicketsList
          groups={true}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
          showTabGroups={showTabGroups}
        />
      </TabPanel>
      <TabPanel value={tab} name='search' className={classes.ticketsWrapper}>
        <TagsFilter onFiltered={handleSelectedTags} />
        {profile === 'admin' && (
          <UsersFilter onFiltered={handleSelectedUsers} />
        )}
        <TicketsList
          isSearch={true}
          searchParam={searchParam}
          showAll={true}
          tags={selectedTags}
          users={selectedUsers}
          selectedQueueIds={selectedQueueIds}
          showTabGroups={showTabGroups}
        />
      </TabPanel>
    </Paper>
  );
};

export default TicketsManagerTabs;
