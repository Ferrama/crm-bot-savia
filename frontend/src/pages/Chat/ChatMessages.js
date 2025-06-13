import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  CheckCircle,
  Download,
  Loader2,
  Mic,
  Paperclip,
  Send,
  StopCircle,
  X,
} from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { AuthContext } from '../../context/Auth/AuthContext';
import { useDate } from '../../hooks/useDate';
import api from '../../services/api';
import { i18n } from '../../translate/i18n';

import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import MicRecorder from 'mic-recorder-to-mp3';
import RecordingTimer from '../../components/MessageInputCustom/RecordingTimer';
import ModalImageCors from '../../components/ModalImageCors';
import toastError from '../../errors/toastError';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 0,
    height: '100%',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
  },
  messageList: {
    position: 'relative',
    overflowY: 'auto',
    height: '100%',
    ...theme.scrollbarStyles,
    backgroundColor: theme.palette.chatlist, //DARK MODE PLW DESIGN//
  },
  inputArea: {
    position: 'relative',
    height: 'auto',
  },
  input: {
    padding: '20px',
  },
  buttonSend: {
    margin: theme.spacing(1),
  },
  boxLeft: {
    padding: '10px 10px 5px',
    margin: '10px',
    position: 'relative',
    backgroundColor: 'blue',
    maxWidth: 300,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    border: '1px solid rgba(0, 0, 0, 0.12)',
  },
  boxRight: {
    padding: '10px 10px 5px',
    margin: '10px 10px 10px auto',
    position: 'relative',
    backgroundColor: 'green', //DARK MODE PLW DESIGN//
    textAlign: 'right',
    maxWidth: 300,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: '1px solid rgba(0, 0, 0, 0.12)',
  },

  sendMessageIcons: {
    color: 'grey',
  },
  uploadInput: {
    display: 'none',
  },
  circleLoading: {
    color: green[500],
    opacity: '70%',
    position: 'absolute',
    top: '20%',
    left: '50%',
    marginLeft: -12,
  },
  viewMediaInputWrapper: {
    display: 'flex',
    padding: '10px 13px',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },

  downloadMedia: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'inherit',
    padding: 10,
  },
  messageMedia: {
    objectFit: 'cover',
    width: 250,
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  recorderWrapper: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'middle',
    justifyContent: 'flex-end',
  },

  cancelAudioIcon: {
    color: 'red',
  },

  audioLoading: {
    color: green[500],
    opacity: '70%',
  },

  sendAudioIcon: {
    color: 'green',
  },
}));

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function ChatMessages({
  chat,
  messages,
  handleSendMessage,
  handleLoadMore,
  scrollToBottomRef,
  pageInfo,
}) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const baseRef = useRef();

  const [contentMessage, setContentMessage] = useState('');
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const scrollToBottom = () => {
    if (baseRef.current) {
      baseRef.current.scrollIntoView({});
    }
  };

  const unreadMessages = (chat) => {
    if (chat !== undefined) {
      const currentUser = chat.users.find((u) => u.userId === user.id);
      return currentUser.unreads > 0;
    }
    return 0;
  };

  useEffect(() => {
    if (unreadMessages(chat) > 0) {
      try {
        api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }
    scrollToBottomRef.current = scrollToBottom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (!pageInfo.hasMore || loading) return;
    if (scrollTop < 600) {
      handleLoadMore();
    }
  };

  const handleChangeMedias = (e) => {
    if (!e.target.files) {
      return;
    }

    const selectedMedias = Array.from(e.target.files);
    setMedias(selectedMedias);
  };

  const checkMessageMedia = (message) => {
    if (message.mediaType === 'image') {
      return <ModalImageCors imageUrl={message.mediaPath} />;
    }
    if (message.mediaType === 'audio') {
      return (
        <audio controls>
          <source src={message.mediaPath} type='audio/ogg'></source>
        </audio>
      );
    }

    if (message.mediaType === 'video') {
      return (
        <video
          className={classes.messageMedia}
          src={message.mediaPath}
          controls
        />
      );
    } else {
      return (
        <>
          <div className={classes.downloadMedia}>
            <Button
              startIcon={<Download size={18} />}
              color='primary'
              variant='outlined'
              target='_blank'
              href={message.mediaPath}
            >
              {i18n.t('internalChat.download')}
            </Button>
          </div>
          {/* <Divider /> */}
        </>
      );
    }
  };

  const handleSendMedia = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append('fromMe', true);
    medias.forEach((media) => {
      formData.append('medias', media);
      formData.append('body', media.name);
    });

    try {
      await api.post(`/chats/${chat.id}/messages`, formData);
    } catch (err) {
      console.log(err);
      toastError(err);
    }

    setLoading(false);
    setMedias([]);
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await Mp3Recorder.start();
      setRecording(true);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleUploadAudio = async () => {
    setLoading(true);
    try {
      const [, blob] = await Mp3Recorder.stop().getMp3();

      if (blob.size < 10000) {
        setLoading(false);
        setRecording(false);
        return;
      }

      const formData = new FormData();
      const filename = `audio-${new Date().getTime()}.mp3`;

      formData.append('medias', blob, filename);
      formData.append('body', filename);
      formData.append('fromMe', true);

      await api.post(`/chats/${chat.id}/messages`, formData);
    } catch (err) {
      toastError(err);
    }

    setRecording(false);
    setLoading(false);
  };

  const handleCancelAudio = async () => {
    try {
      await Mp3Recorder.stop().getMp3();
      setRecording(false);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Paper className={classes.mainContainer}>
      <div onScroll={handleScroll} className={classes.messageList}>
        {Array.isArray(messages) &&
          messages.map((item, key) => {
            if (item.senderId === user.id) {
              return (
                <Box key={key} className={classes.boxRight}>
                  <Typography variant='subtitle2'>
                    {item.sender.name}
                  </Typography>
                  {item.mediaPath && checkMessageMedia(item)}
                  {item.message}
                  <Typography variant='caption' display='block'>
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            } else {
              return (
                <Box key={key} className={classes.boxLeft}>
                  <Typography variant='subtitle2'>
                    {item.sender.name}
                  </Typography>
                  {item.mediaPath && checkMessageMedia(item)}
                  {item.message}
                  <Typography variant='caption' display='block'>
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            }
          })}
        <div ref={baseRef}></div>
      </div>
      <div className={classes.inputArea}>
        <FormControl variant='outlined' fullWidth>
          {recording ? (
            <div className={classes.recorderWrapper}>
              <IconButton
                aria-label='cancelRecording'
                component='span'
                fontSize='large'
                disabled={loading}
                onClick={handleCancelAudio}
              >
                <StopCircle color='red' size={22} />
              </IconButton>
              {loading ? (
                <div>
                  <Loader2 className={classes.audioLoading} />
                </div>
              ) : (
                <RecordingTimer />
              )}

              <IconButton
                aria-label='sendRecordedAudio'
                component='span'
                onClick={handleUploadAudio}
                disabled={loading}
              >
                <CheckCircle color='green' size={22} />
              </IconButton>
            </div>
          ) : (
            <>
              {medias.length > 0 ? (
                <>
                  <Paper
                    elevation={0}
                    square
                    className={classes.viewMediaInputWrapper}
                  >
                    <IconButton
                      aria-label='cancel-upload'
                      component='span'
                      onClick={(e) => setMedias([])}
                    >
                      <X className={classes.sendMessageIcons} size={20} />
                    </IconButton>

                    {loading ? (
                      <div>
                        <CircularProgress className={classes.circleLoading} />
                      </div>
                    ) : (
                      <span>{medias[0]?.name}</span>
                    )}
                    <IconButton
                      aria-label='send-upload'
                      component='span'
                      onClick={handleSendMedia}
                      disabled={loading}
                    >
                      <Send className={classes.sendMessageIcons} size={20} />
                    </IconButton>
                  </Paper>
                </>
              ) : (
                <React.Fragment>
                  <Input
                    multiline
                    value={contentMessage}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' && contentMessage.trim() !== '') {
                        handleSendMessage(contentMessage);
                        setContentMessage('');
                      }
                    }}
                    onChange={(e) => setContentMessage(e.target.value)}
                    className={classes.input}
                    startAdornment={
                      <InputAdornment position='start'>
                        <FileInput
                          disableOption={loading}
                          handleChangeMedias={handleChangeMedias}
                        />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position='end'>
                        {contentMessage ? (
                          <IconButton
                            onClick={() => {
                              if (contentMessage.trim() !== '') {
                                handleSendMessage(contentMessage);
                                setContentMessage('');
                              }
                            }}
                            className={classes.buttonSend}
                          >
                            <Send size={20} />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label='showRecorder'
                            component='span'
                            disabled={loading}
                            onClick={handleStartRecording}
                          >
                            <Mic
                              className={classes.sendMessageIcons}
                              size={20}
                            />
                          </IconButton>
                        )}
                      </InputAdornment>
                    }
                  />
                </React.Fragment>
              )}
            </>
          )}
        </FormControl>
      </div>
    </Paper>
  );
}

const FileInput = (props) => {
  const { handleChangeMedias, disableOption } = props;
  const classes = useStyles();
  return (
    <>
      <input
        multiple
        type='file'
        id='upload-button'
        disabled={disableOption}
        className={classes.uploadInput}
        onChange={handleChangeMedias}
      />
      <label htmlFor='upload-button'>
        <IconButton
          aria-label='upload'
          component='span'
          disabled={disableOption}
        >
          <Paperclip className={classes.sendMessageIcons} size={20} />
        </IconButton>
      </label>
    </>
  );
};
