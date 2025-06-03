import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  inline: {
    width: '100%',
  },
}));

export default function ContactNotesDialogListItem(props) {
  const { note, deleteItem } = props;
  const classes = useStyles();

  const handleDelete = (item) => {
    deleteItem(item);
  };

  return (
    <ListItem alignItems='flex-start'>
      <ListItemAvatar>
        <Avatar alt={note.user.name} src='/static/images/avatar/1.jpg' />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography
              component='span'
              variant='body2'
              className={classes.inline}
              color='textPrimary'
            >
              {note.note}
            </Typography>
          </>
        }
        secondary={
          <>
            {note.user.name}, {moment(note.createdAt).format('DD/MM/YY HH:mm')}
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge='end'
          aria-label='delete'
          onClick={() => handleDelete(note)}
        >
          <Trash2 size={20} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

ContactNotesDialogListItem.propTypes = {
  note: PropTypes.object.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
