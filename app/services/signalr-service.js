import Ember from 'ember';

const { get, set } = Ember;

export default Ember.Service.extend({
  connection: null,
  connected: false,

  init() {
    Ember.Logger.log('service init happened');
    this._super(...arguments);
    set(this, 'connection', Ember.$.connection);
    set(this, 'connection.hub.url', 'http://apidev.secondstreetapp.com:10904/signalr');
    this.connect();
  },
  /**
   * Sets the 'connected' property if the connection is created.
   * @returns {RSVP.Promise}
   **/
  connect() {
    const signalr = this;
    return new Ember.RSVP.Promise((resolve, reject) => {
      get(this, 'connection.hub').start({
        withCredentials: false
      }).then(() => {
        Ember.Logger.log('connected');
        set(signalr, 'connected', true);
        resolve();
      }, (error) => {
        Ember.Logger.log('Connection error:', error);
        set(signalr, 'connected', false);
        reject(error);
      });
    });
  }
});
