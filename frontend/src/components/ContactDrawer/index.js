import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Edit3, X } from 'lucide-react';

import { i18n } from '../../translate/i18n';

import { CardHeader } from '@material-ui/core';
import WhatsMarked from 'react-whatsmarked';
import { generateColor } from '../../helpers/colorGenerator';
import { getInitials } from '../../helpers/getInitials';
import useSettings from '../../hooks/useSettings';
import ContactDrawerSkeleton from '../ContactDrawerSkeleton';
import { ContactForm } from '../ContactForm';
import ContactModal from '../ContactModal';
import { ContactNotes } from '../ContactNotes';
import { TagsContainer } from '../TagsContainer';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down(1400)]: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
    },
  },

  drawerHidden: {
    display: 'none',
  },

  drawerPaper: {
    width: drawerWidth,
    display: 'flex',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  header: {
    display: 'flex',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    minHeight: '73px',
    justifyContent: 'flex-start',
  },
  content: {
    display: 'flex',

    flexDirection: 'column',
    padding: '8px 0px 8px 8px',
    height: '100%',
    overflowY: 'scroll',
    ...theme.scrollbarStyles,
  },

  contactAvatar: {
    margin: 15,
    width: 100,
    height: 100,
  },

  contactHeader: {
    display: 'flex',
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
      margin: 4,
    },
  },

  contactDetails: {
    marginTop: 8,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  contactExtraInfo: {
    marginTop: 4,
    padding: 6,
  },
}));

const ContactDrawer = ({
  open,
  handleDrawerClose,
  contact,
  ticket,
  loading,
}) => {
  const classes = useStyles();
  const { getSetting } = useSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    getSetting('tagsMode').then((res) => {
      setShowTags(['contact', 'both'].includes(res));
    });

    setOpenForm(false);
  }, [open, contact]);

  return (
    <>
      <Drawer
        className={open ? classes.drawer : classes.drawerHidden}
        variant='persistent'
        anchor='right'
        open={open}
        PaperProps={{ style: { position: 'absolute' } }}
        BackdropProps={{ style: { position: 'absolute' } }}
        ModalProps={{
          container: document.getElementById('drawer-container'),
          style: { position: 'absolute' },
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.header}>
          <IconButton onClick={handleDrawerClose}>
            <X />
          </IconButton>
          <Typography style={{ justifySelf: 'center' }}>
            {i18n.t('contactDrawer.header')}
          </Typography>
        </div>
        {loading ? (
          <ContactDrawerSkeleton classes={classes} />
        ) : (
          <div className={classes.content}>
            <Paper square variant='outlined' className={classes.contactHeader}>
              <CardHeader
                onClick={() => {}}
                style={{ cursor: 'pointer', width: '100%' }}
                titleTypographyProps={{ noWrap: true }}
                subheaderTypographyProps={{ noWrap: true }}
                avatar={
                  <Avatar
                    src={contact.profilePicUrl}
                    alt='contact_image'
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: generateColor(contact?.number),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {getInitials(contact?.name)}
                  </Avatar>
                }
                title={
                  <>
                    <Typography onClick={() => setOpenForm(true)}>
                      {contact.name}
                      <Edit3 style={{ fontSize: 16, marginLeft: 5 }} />
                    </Typography>
                  </>
                }
                subheader={
                  <>
                    <Typography style={{ fontSize: 12 }}>
                      <Link href={`tel:${contact.number}`}>
                        {contact.number}
                      </Link>
                    </Typography>
                    <Typography style={{ fontSize: 12 }}>
                      <Link href={`mailto:${contact.email}`}>
                        {contact.email}
                      </Link>
                    </Typography>
                  </>
                }
              />
              <Button
                variant='outlined'
                color='primary'
                onClick={() => setModalOpen(!openForm)}
                style={{ fontSize: 12 }}
              >
                {i18n.t('contactDrawer.buttons.edit')}
              </Button>
              {contact.id && openForm && (
                <ContactForm
                  initialContact={contact}
                  onCancel={() => setOpenForm(false)}
                />
              )}
            </Paper>
            {showTags && (
              <Paper
                square
                variant='outlined'
                className={classes.contactDetails}
              >
                <TagsContainer contact={contact} />
              </Paper>
            )}
            <Paper square variant='outlined' className={classes.contactDetails}>
              <Typography variant='subtitle1' style={{ marginBottom: 10 }}>
                {i18n.t('ticketOptionsMenu.appointmentsModal.title')}
              </Typography>
              <ContactNotes ticket={ticket} />
            </Paper>
            <Paper square variant='outlined' className={classes.contactDetails}>
              <ContactModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                contactId={contact.id}
              ></ContactModal>
              <Typography variant='subtitle1'>
                {i18n.t('contactDrawer.extraInfo')}
              </Typography>
              {contact?.extraInfo?.map((info) => (
                <Paper
                  key={info.id}
                  square
                  variant='outlined'
                  className={classes.contactExtraInfo}
                >
                  <InputLabel>{info.name}</InputLabel>
                  <Typography component='div' noWrap style={{ paddingTop: 2 }}>
                    <WhatsMarked>{info.value}</WhatsMarked>
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default ContactDrawer;
