import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('huayra-archivo', 'Integration | Component | huayra archivo', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{huayra-archivo}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#huayra-archivo}}
      template block text
    {{/huayra-archivo}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
