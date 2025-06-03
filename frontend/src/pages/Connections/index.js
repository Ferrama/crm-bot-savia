import { format, parseISO } from 'date-fns';
import React, { useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import {
  CheckCircle,
  Lock,
  Pencil,
  PowerOff,
  QrCode,
  RefreshCw,
  RotateCcw,
  ScanQrCodeIcon,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';

import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MainContainer from '../../components/MainContainer';
import MainHeader from '../../components/MainHeader';
import MainHeaderButtonsWrapper from '../../components/MainHeaderButtonsWrapper';
import TableRowSkeleton from '../../components/TableRowSkeleton';
import Title from '../../components/Title';

import ConfirmationModal from '../../components/ConfirmationModal';
import PrivacyModal from '../../components/PrivacyModal';
import QrcodeModal from '../../components/QrcodeModal';
import WhatsAppModal from '../../components/WhatsAppModal';
import { WhatsAppsContext } from '../../context/WhatsApp/WhatsAppsContext';
import toastError from '../../errors/toastError';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: 'scroll',
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(14),
    border: '1px solid #dadde9',
    maxWidth: 450,
  },
  tooltipPopper: {
    textAlign: 'center',
  },
  buttonProgress: {
    color: green[500],
  },
}));

const CustomToolTip = ({ title, content, children }) => {
  const classes = useStyles();

  return (
    <Tooltip
      arrow
      classes={{
        tooltip: classes.tooltip,
        popper: classes.tooltipPopper,
      }}
      title={
        <React.Fragment>
          <Typography gutterBottom color='inherit'>
            {title}
          </Typography>
          {content && <Typography>{content}</Typography>}
        </React.Fragment>
      }
    >
      {children}
    </Tooltip>
  );
};

const Connections = () => {
  const classes = useStyles();

  const { whatsApps, loading, refetch } = useContext(WhatsAppsContext);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmationModalInitialState = {
    action: '',
    title: '',
    message: '',
    whatsAppId: '',
    open: false,
  };
  const [confirmModalInfo, setConfirmModalInfo] = useState(
    confirmationModalInitialState
  );

  const handleStartWhatsAppSession = async (whatsAppId) => {
    try {
      await api.post(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleRequestNewQrCode = async (whatsAppId) => {
    try {
      await api.put(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenWhatsAppModal = () => {
    setSelectedWhatsApp(null);
    setWhatsAppModalOpen(true);
  };

  const handleCloseWhatsAppModal = useCallback(() => {
    setWhatsAppModalOpen(false);
    setSelectedWhatsApp(null);
  }, [setSelectedWhatsApp, setWhatsAppModalOpen]);

  const handleOpenQrModal = (whatsApp) => {
    setSelectedWhatsApp(whatsApp);
    setQrModalOpen(true);
  };

  const handleCloseQrModal = useCallback(() => {
    setSelectedWhatsApp(null);
    setQrModalOpen(false);
  }, [setQrModalOpen, setSelectedWhatsApp]);

  const handleEditWhatsApp = (whatsApp) => {
    setSelectedWhatsApp(whatsApp);
    setWhatsAppModalOpen(true);
  };

  const handleOpenPrivacyWhatsApp = (whatsApp) => {
    setSelectedWhatsApp(whatsApp);
    setPrivacyModalOpen(true);
  };

  const handleClosePrivacyWhatsAppModal = useCallback(() => {
    setSelectedWhatsApp(null);
    setPrivacyModalOpen(false);
  }, [setPrivacyModalOpen, setSelectedWhatsApp]);

  const handleOpenConfirmationModal = (action, whatsAppId) => {
    if (action === 'disconnect') {
      setConfirmModalInfo({
        action: action,
        title: i18n.t('connections.confirmationModal.disconnectTitle'),
        message: i18n.t('connections.confirmationModal.disconnectMessage'),
        whatsAppId: whatsAppId,
      });
    }

    if (action === 'delete') {
      setConfirmModalInfo({
        action: action,
        title: i18n.t('connections.confirmationModal.deleteTitle'),
        message: i18n.t('connections.confirmationModal.deleteMessage'),
        whatsAppId: whatsAppId,
      });
    }
    setConfirmModalOpen(true);
  };

  const handleSubmitConfirmationModal = async () => {
    if (confirmModalInfo.action === 'disconnect') {
      try {
        await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
      } catch (err) {
        toastError(err);
      }
    }

    if (confirmModalInfo.action === 'delete') {
      try {
        await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t('connections.toasts.deleted'));
      } catch (err) {
        toastError(err);
      }
    }

    setConfirmModalInfo(confirmationModalInitialState);
  };

  const refreshWhatsApp = async (whatsApp) => {
    try {
      await api.get(`/whatsappsession/refresh/${whatsApp.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success(i18n.t('common.refreshed'));
    } catch (err) {
      toastError(err);
    }
  };

  const renderActionButtons = (whatsApp) => {
    return (
      <>
        {whatsApp.status === 'qrcode' && (
          <CustomToolTip title={i18n.t('connections.toolTips.scan')}>
            <IconButton
              size='small'
              onClick={() => handleOpenQrModal(whatsApp)}
            >
              <QrCode size={20} />
            </IconButton>
          </CustomToolTip>
        )}
        {whatsApp.status === 'DISCONNECTED' && (
          <>
            <CustomToolTip title={i18n.t('connections.toolTips.retry')}>
              <IconButton
                size='small'
                onClick={() => handleStartWhatsAppSession(whatsApp.id)}
              >
                <RotateCcw size={20} />
              </IconButton>
            </CustomToolTip>

            <CustomToolTip title={i18n.t('connections.toolTips.newQr')}>
              <IconButton
                size='small'
                onClick={() => handleRequestNewQrCode(whatsApp.id)}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </IconButton>
            </CustomToolTip>
          </>
        )}
        {(whatsApp.status === 'CONNECTED' ||
          whatsApp.status === 'PAIRING' ||
          whatsApp.status === 'TIMEOUT') && (
          <CustomToolTip title={i18n.t('connections.toolTips.disconnect')}>
            <IconButton
              size='small'
              onClick={() => {
                handleOpenConfirmationModal('disconnect', whatsApp.id);
              }}
            >
              <PowerOff color='red' size={20} />
            </IconButton>
          </CustomToolTip>
        )}
        {whatsApp.status === 'CONNECTED' && whatsApp.channel === 'whatsapp' && (
          <CustomToolTip title={i18n.t('connections.toolTips.refresh')}>
            <IconButton size='small' onClick={() => refreshWhatsApp(whatsApp)}>
              <RefreshCw size={20} />
            </IconButton>
          </CustomToolTip>
        )}
      </>
    );
  };

  const renderStatusToolTips = (whatsApp) => {
    return (
      <div className={classes.customTableCell}>
        {whatsApp.status === 'DISCONNECTED' && (
          <CustomToolTip
            title={i18n.t('connections.toolTips.disconnected.title')}
            content={i18n.t('connections.toolTips.disconnected.content')}
          >
            <WifiOff color='secondary' size={20} />
          </CustomToolTip>
        )}
        {whatsApp.status === 'OPENING' && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {whatsApp.status === 'qrcode' && (
          <CustomToolTip
            title={i18n.t('connections.toolTips.qrcode.title')}
            content={i18n.t('connections.toolTips.qrcode.content')}
          >
            <ScanQrCodeIcon size={20} />
          </CustomToolTip>
        )}
        {whatsApp.status === 'CONNECTED' && (
          <CustomToolTip title={i18n.t('connections.toolTips.connected.title')}>
            <Wifi style={{ color: green[500] }} size={20} />
          </CustomToolTip>
        )}
        {(whatsApp.status === 'TIMEOUT' || whatsApp.status === 'PAIRING') && (
          <CustomToolTip
            title={i18n.t('connections.toolTips.timeout.title')}
            content={i18n.t('connections.toolTips.timeout.content')}
          >
            <WifiOff color='secondary' size={20} />
          </CustomToolTip>
        )}
      </div>
    );
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={confirmModalInfo.title}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={handleSubmitConfirmationModal}
      >
        {confirmModalInfo.message}
      </ConfirmationModal>
      <QrcodeModal
        open={qrModalOpen}
        onClose={handleCloseQrModal}
        whatsAppId={
          !whatsAppModalOpen && !privacyModalOpen && selectedWhatsApp?.id
        }
      />
      <WhatsAppModal
        open={whatsAppModalOpen}
        onClose={handleCloseWhatsAppModal}
        whatsAppId={!qrModalOpen && !privacyModalOpen && selectedWhatsApp?.id}
      />
      <PrivacyModal
        open={privacyModalOpen}
        onClose={handleClosePrivacyWhatsAppModal}
        whatsAppId={!qrModalOpen && !whatsAppModalOpen && selectedWhatsApp?.id}
      />
      <MainHeader>
        <Title>{i18n.t('connections.title')}</Title>
        <MainHeaderButtonsWrapper>
          <IconButton variant='contained' onClick={handleRefresh}>
            <RefreshCw size={20} />
          </IconButton>
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenWhatsAppModal}
          >
            {i18n.t('connections.buttons.add')}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                {i18n.t('connections.table.name')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('connections.table.status')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('connections.table.session')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('connections.table.lastUpdate')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('connections.table.default')}
              </TableCell>
              <TableCell align='center'>
                {i18n.t('connections.table.actions')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowSkeleton />
            ) : (
              <>
                {whatsApps?.length > 0 &&
                  whatsApps.map((whatsApp) => (
                    <TableRow key={whatsApp.id}>
                      <TableCell align='center'>{whatsApp.name}</TableCell>
                      <TableCell align='center'>
                        {renderStatusToolTips(whatsApp)}
                      </TableCell>
                      <TableCell align='center'>
                        {renderActionButtons(whatsApp)}
                      </TableCell>
                      <TableCell align='center'>
                        {format(parseISO(whatsApp.updatedAt), 'dd/MM/yy HH:mm')}
                      </TableCell>
                      <TableCell align='center'>
                        {whatsApp.isDefault && (
                          <div className={classes.customTableCell}>
                            <CheckCircle
                              style={{ color: green[500] }}
                              size={20}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton
                          size='small'
                          onClick={() => handleEditWhatsApp(whatsApp)}
                        >
                          <Pencil size={20} />
                        </IconButton>

                        {whatsApp.status === 'CONNECTED' && (
                          <IconButton
                            size='small'
                            onClick={() => handleOpenPrivacyWhatsApp(whatsApp)}
                          >
                            <Lock size={20} />
                          </IconButton>
                        )}

                        <IconButton
                          size='small'
                          onClick={(e) => {
                            handleOpenConfirmationModal('delete', whatsApp.id);
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Connections;
