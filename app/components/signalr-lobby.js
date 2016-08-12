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
    set(this, 'users', Ember.A());
    set(this, 'messages', Ember.A());
    const lobbyHub = get(this, 'lobbyHub');

    // Assign callback functions that the hub may broadcast to.
    lobbyHub.client.lobbyEntered = this.lobbyEntered.bind(this);
    lobbyHub.client.chatSent = this.messageReceived.bind(this);
    lobbyHub.client.userArrived = this.userArrived.bind(this);
    lobbyHub.client.userDisconnected = this.userDisconnected.bind(this);
  },

  lobbyEntered(topic, users) {
    Ember.Logger.log('Lobby entered', topic, users);
    const userList = Ember.A(users).map((item) => {
      return User.create({
        name: item.Name
      });
    });
    set(this, 'joined', true);
    set(this, 'users', userList);
  },
  messageReceived(name, messageText) {
    Ember.Logger.log('Message received', name, message);
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
  },
  userDisconnected(user) {
    const oldUser = get(this, 'users').findBy('connectionId', user.ConnectionId);
    set(this, 'users', get(this, 'users').without(oldUser));
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
