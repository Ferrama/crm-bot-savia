import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Edit3, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { i18n } from '../../translate/i18n';

import TableRowSkeleton from '../../components/TableRowSkeleton';

function QuickMessagesTable(props) {
  const { messages, showLoading, editMessage, deleteMessage, readOnly } = props;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Array.isArray(messages)) {
      setRows(messages);
    }
    if (showLoading !== undefined) {
      setLoading(showLoading);
    }
  }, [messages, showLoading]);

  const handleEdit = (message) => {
    editMessage(message);
  };

  const handleDelete = (message) => {
    deleteMessage(message);
  };

  const renderRows = () => {
    return rows.map((message) => {
      return (
        <TableRow key={message.id}>
          <TableCell align='center'>{message.shortcode}</TableCell>
          <TableCell align='left'>{message.message}</TableCell>
          {!readOnly ? (
            <TableCell align='center'>
              <IconButton size='small' onClick={() => handleEdit(message)}>
                <Edit3 size={20} />
              </IconButton>

              <IconButton size='small' onClick={() => handleDelete(message)}>
                <Trash2 size={20} />
              </IconButton>
            </TableCell>
          ) : null}
        </TableRow>
      );
    });
  };

  return (
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell align='center'>
            {i18n.t('quickMessages.dialog.shortcode')}
          </TableCell>
          <TableCell align='left'>
            {i18n.t('quickMessages.dialog.message')}
          </TableCell>
          {!readOnly ? (
            <TableCell align='center'>{i18n.t('common.actions')}</TableCell>
          ) : null}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRowSkeleton columns={readOnly ? 2 : 3} />
        ) : (
          renderRows()
        )}
      </TableBody>
    </Table>
  );
}

QuickMessagesTable.propTypes = {
  messages: PropTypes.array.isRequired,
  showLoading: PropTypes.bool,
  editMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
};

export default QuickMessagesTable;
