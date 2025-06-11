import { createContext } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import openSocket from 'socket.io-client';
import api from '../../services/api';
import { getBackendSocketURL } from '../../services/config';

class ManagedSocket {
  constructor(socketManager) {
    this.socketManager = socketManager;
    this.rawSocket = socketManager.currentSocket;
    this.callbacks = [];
    this.joins = [];

    this.rawSocket.on('connect', () => {
      if (this.rawSocket.io.opts.query?.r && !this.rawSocket.recovered) {
        const refreshJoinsOnReady = () => {
          for (const j of this.joins) {
            console.debug('refreshing join', j);
            this.rawSocket.emit(`join${j.event}`, ...j.params);
          }
          this.rawSocket.off('ready', refreshJoinsOnReady);
        };
        for (const j of this.callbacks) {
          this.rawSocket.off(j.event, j.callback);
          this.rawSocket.on(j.event, j.callback);
        }

        this.rawSocket.on('ready', refreshJoinsOnReady);
      }
    });
  }

  on(event, callback) {
    if (event === 'ready' || event === 'connect') {
      return this.socketManager.onReady(callback);
    }
    this.callbacks.push({ event, callback });
    return this.rawSocket.on(event, callback);
  }

  off(event, callback) {
    const i = this.callbacks.findIndex(
      (c) => c.event === event && c.callback === callback
    );
    this.callbacks.splice(i, 1);
    return this.rawSocket.off(event, callback);
  }

  emit(event, ...params) {
    if (event.startsWith('join')) {
      this.joins.push({ event: event.substring(4), params });
      console.debug('Joining', { event: event.substring(4), params });
    }
    return this.rawSocket.emit(event, ...params);
  }

  disconnect() {
    for (const j of this.joins) {
      this.rawSocket.emit(`leave${j.event}`, ...j.params);
    }
    this.joins = [];
    for (const c of this.callbacks) {
      this.rawSocket.off(c.event, c.callback);
    }
    this.callbacks = [];
  }
}

class DummySocket {
  on(..._) {}
  off(..._) {}
  emit(..._) {}
  disconnect() {}
}

const socketManager = {
  currentCompanyId: -1,
  currentUserId: -1,
  currentSocket: null,
  socketReady: false,

  GetSocket: function (_discardCompanyId = null) {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      return new DummySocket();
    }

    const { userId, companyId } = decodeToken(token);

    if (companyId !== this.currentCompanyId || userId !== this.currentUserId) {
      if (this.currentSocket) {
        console.debug('closing old socket - company or user changed');
        this.currentSocket.removeAllListeners();
        this.currentSocket.disconnect();
        this.currentSocket = null;
        this.currentCompanyId = null;
        this.currentUserId = null;
      }

      if (isExpired(token)) {
        console.debug('Expired token, refreshing token');

        api.get('/auth/me').then((response) => {
          console.debug('Token refreshed', response);
          window.location.reload();
        });

        return new DummySocket();
      }

      this.currentCompanyId = companyId;
      this.currentUserId = userId;

      this.currentSocket = openSocket(getBackendSocketURL(), {
        transports: ['websocket'],
        pingTimeout: 18000,
        pingInterval: 18000,
        query: { token },
      });

      this.currentSocket.io.on('reconnect_attempt', () => {
        this.currentSocket.io.opts.query.r = 1;
        const newToken = JSON.parse(localStorage.getItem('token'));
        if (isExpired(newToken)) {
          console.debug('Refreshing');
          window.location.reload();
        } else {
          console.debug('Using new token');
          this.currentSocket.io.opts.query.token = newToken;
        }
      });

      this.currentSocket.on('disconnect', (reason) => {
        console.debug(`socket disconnected because: ${reason}`);
        if (reason.startsWith('io server disconnect')) {
          console.debug('tryng to reconnect', this.currentSocket);
          const newToken = JSON.parse(localStorage.getItem('token'));

          if (isExpired(newToken)) {
            console.debug('Expired token - refreshing');
            window.location.reload();
            return;
          }
          console.debug('Reconnecting using refreshed token');
          this.currentSocket.io.opts.query.token = newToken;
          this.currentSocket.io.opts.query.r = 1;
          this.currentSocket.connect();
        }
      });

      this.currentSocket.on('connect', (...params) => {
        console.debug('socket connected', params);
      });

      this.currentSocket.onAny((event, ...args) => {
        if (event === 'backendlog') {
          return;
        }
        console.debug('Event: ', { socket: this.currentSocket, event, args });
      });

      this.onReady(() => {
        this.socketReady = true;
      });
    }

    return new ManagedSocket(this);
  },

  onReady: function (callbackReady) {
    if (this.socketReady) {
      callbackReady();
      return;
    }

    if (!this.currentSocket) {
      return;
    }

    this.currentSocket.once('ready', () => {
      callbackReady();
    });
  },

  onConnect: function (callbackReady) {
    this.onReady(callbackReady);
  },
};

const SocketContext = createContext();

export { SocketContext, socketManager };
