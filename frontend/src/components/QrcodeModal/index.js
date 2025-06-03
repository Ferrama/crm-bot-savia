import QRCode from 'qrcode.react';
import React, { useContext, useEffect, useState } from 'react';
import toastError from '../../errors/toastError';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { SocketContext } from '../../context/Socket/SocketContext';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  qrcodeFrame: {
    padding: '10px',
    backgroundColor: '#fff',
  },
}));

const QrcodeModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [qrCode, setQrCode] = useState('');

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setQrCode(data.qrcode);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    if (!whatsAppId) return;
    const companyId = localStorage.getItem('companyId');
    const socket = socketManager.GetSocket(companyId);

    const onCompanyWhatsappSession = (data) => {
      if (data.action === 'update' && data.session.id === whatsAppId) {
        setQrCode(data.session.qrcode);
      }

      if (data.action === 'update' && data.session.qrcode === '') {
        onClose();
      }
    };

    socket.on(`company-${companyId}-whatsappSession`, onCompanyWhatsappSession);

    return () => {
      socket.disconnect();
    };
  }, [whatsAppId, onClose, socketManager]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' scroll='paper'>
      <DialogTitle style={{ textAlign: 'center', padding: '16px 0 16px 0' }}>
        {i18n.t('qrCode.message')}
      </DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '36px',
        }}
      >
        <Paper elevation={0}>
          {qrCode ? (
            <QRCode className={classes.qrcodeFrame} value={qrCode} size={256} />
          ) : (
            <span>Waiting for QR Code</span>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(QrcodeModal);
