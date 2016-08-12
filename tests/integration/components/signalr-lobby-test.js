import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('signalr-lobby', 'Integration | Component | signalr lobby', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{signalr-lobby}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#signalr-lobby}}
      template block text
    {{/signalr-lobby}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
