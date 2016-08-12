import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  signalrService: Ember.inject.service('signalr-service'),
  chatHub: Ember.computed.alias('signalrService.connection.chat'),
  connected: Ember.computed.alias('signalrService.connected'),

  init() {
    this._super(...arguments);
    const chatHub = get(this, 'chatHub');

    // Assign callback functions that the hub may broadcast to.
    chatHub.client.broadcastMessage = this.messageReceived.bind(this);
  },

  messageReceived(name, message) {
    Ember.Logger.log('Message received', name, message, this.toString());
  },

  actions: {
    sendMessage(message) {
      const chatHub = get(this, 'chatHub');
      chatHub.server.send(get(this, 'name'), message);
    }
  }
});
