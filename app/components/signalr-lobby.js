import Ember from 'ember';
import User from 'socket-demo-2/models/user';
import Message from 'socket-demo-2/models/message';

const { get, set } = Ember;

export default Ember.Component.extend({
  signalrService: Ember.inject.service('signalr-service'),
  lobbyHub: Ember.computed.alias('signalrService.connection.lobby'),
  connected: Ember.computed.alias('signalrService.connected'),
  users: [],
  messages: [],

  init() {
    this._super(...arguments);
    set(this, 'users', []);
    set(this, 'messages', []);
    const lobbyHub = get(this, 'lobbyHub');

    // Assign callback functions that the hub may broadcast to.
    lobbyHub.client.lobbyEntered = this.lobbyEntered.bind(this);
    lobbyHub.client.chatSent = this.messageReceived.bind(this);
    lobbyHub.client.userArrived = this.userArrived.bind(this);
    lobbyHub.client.userDisconnected = this.userDisconnected.bind(this);
  },

  lobbyEntered(topic, users) {
    const userList = Ember.A(users).map((item) => {
      return User.create({
        connectionId: item.ConnectionId,
        name: item.Name
      });
    });
    set(this, 'users', userList);
    set(this, 'joined', true);
  },
  messageReceived(name, messageText) {
    const message = Message.create({
      name: name,
      message: messageText
    });
    get(this, 'messages').addObject(message);
  },
  userArrived(user) {
    const newUser = User.create({
      connectionId: user.ConnectionId,
      name: user.Name
    });
    get(this, 'users').addObject(newUser);
    this.messageReceived(null, `User ${user.Name} arrived`);
  },
  userDisconnected(user) {
    const oldUser = get(this, 'users').findBy('connectionId', user.ConnectionId);
    if (oldUser) {
      get(this, 'users').removeObject(oldUser);
      this.messageReceived(null, `User ${user.Name} disconnected`);
    }
  },

  actions: {
    join(name) {
      const lobbyHub = get(this, 'lobbyHub');
      lobbyHub.server.join(name);
    },
    sendMessage(message) {
      const lobbyHub = get(this, 'lobbyHub');
      lobbyHub.server.sendChat(message);
      set(this, 'message', '');
    }
  }
});
