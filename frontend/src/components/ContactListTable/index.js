import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Edit3, Trash2, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import TableRowSkeleton from '../../components/TableRowSkeleton';

function ContactListsTable(props) {
  const {
    contactLists,
    showLoading,
    editContactList,
    deleteContactList,
    readOnly,
  } = props;
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Array.isArray(contactLists)) {
      setRows(contactLists);
    }
    if (showLoading !== undefined) {
      setLoading(showLoading);
    }
  }, [contactLists, showLoading]);

  const handleEdit = (contactList) => {
    editContactList(contactList);
  };

  const handleDelete = (contactList) => {
    deleteContactList(contactList);
  };

  const renderRows = () => {
    return rows.map((contactList) => {
      return (
        <TableRow key={contactList.id}>
          <TableCell align='left'>{contactList.name}</TableCell>
          <TableCell align='center'></TableCell>
          {!readOnly ? (
            <TableCell align='center'>
              <IconButton size='small'>
                <Users />
              </IconButton>

              <IconButton size='small' onClick={() => handleEdit(contactList)}>
                <Edit3 />
              </IconButton>

              <IconButton
                size='small'
                onClick={() => handleDelete(contactList)}
              >
                <Trash2 />
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
          <TableCell align='left'>Nome</TableCell>
          <TableCell align='center'>Contatos</TableCell>
          {!readOnly ? <TableCell align='center'>Ações</TableCell> : null}
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

ContactListsTable.propTypes = {
  contactLists: PropTypes.array.isRequired,
  showLoading: PropTypes.bool,
  editContactList: PropTypes.func.isRequired,
  deleteContactList: PropTypes.func.isRequired,
};

export default ContactListsTable;
