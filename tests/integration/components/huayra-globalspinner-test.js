import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('huayra-globalspinner', 'Integration | Component | huayra globalspinner', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{huayra-globalspinner}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#huayra-globalspinner}}
      template block text
    {{/huayra-globalspinner}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
